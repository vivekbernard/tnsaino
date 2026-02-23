package com.portal.service;

import com.portal.dto.Company;
import com.portal.dto.PageResponse;
import com.portal.util.TableNames;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.portal.util.ValidationUtil.*;

@Service
public class CompanyService {

    private final JdbcClient jdbcClient;
    private final JobService jobService;
    private final String table = TableNames.COMPANIES;

    public CompanyService(JdbcClient jdbcClient, JobService jobService) {
        this.jdbcClient = jdbcClient;
        this.jobService = jobService;
    }

    private static final String SELECT_COLUMNS = """
            CAST(id AS text) AS id, CAST(user_id AS text) AS user_id,
            name, logo_url, details, corporate_website,
            hr_contact_name, hr_contact_email, legal_contact_name, legal_contact_email,
            status, is_deleted, CAST(deleted_at AS text) AS deleted_at,
            CAST(created_at AS text) AS created_at, CAST(updated_at AS text) AS updated_at
            """;

    public Company findById(String id) {
        validateUuid(id, "id");
        String sql = "SELECT %s FROM %s WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE"
                .formatted(SELECT_COLUMNS, table);
        return jdbcClient.sql(sql)
                .param("id", id)
                .query(Company.class)
                .optional().orElse(null);
    }

    public Company findByUserId(String userId) {
        validateUuid(userId, "userId");
        String sql = "SELECT %s FROM %s WHERE user_id = CAST(:userId AS uuid) AND is_deleted = FALSE"
                .formatted(SELECT_COLUMNS, table);
        return jdbcClient.sql(sql)
                .param("userId", userId)
                .query(Company.class)
                .optional().orElse(null);
    }

    public PageResponse<Company> listCompanies(int page, int size) {
        long total = countActive();
        String sql = "SELECT %s FROM %s WHERE is_deleted = FALSE ORDER BY created_at DESC LIMIT :size OFFSET :offset"
                .formatted(SELECT_COLUMNS, table);
        List<Company> list = jdbcClient.sql(sql)
                .param("size", size)
                .param("offset", page * size)
                .query(Company.class)
                .list();
        return PageResponse.of(list, page, size, total);
    }

    public PageResponse<Company> listAllIncludingDeleted(int page, int size) {
        long total = countAll();
        String sql = "SELECT %s FROM %s ORDER BY created_at DESC LIMIT :size OFFSET :offset"
                .formatted(SELECT_COLUMNS, table);
        List<Company> list = jdbcClient.sql(sql)
                .param("size", size)
                .param("offset", page * size)
                .query(Company.class)
                .list();
        return PageResponse.of(list, page, size, total);
    }

    public void upsert(Company c) {
        validateUuid(c.id(), "id");
        validateRequired(c.name(), "name");
        String sql = """
                INSERT INTO %s (id, user_id, name, logo_url, details, corporate_website,
                    hr_contact_name, hr_contact_email, legal_contact_name, legal_contact_email,
                    status, created_at, updated_at)
                VALUES (CAST(:id AS uuid), CAST(:userId AS uuid), :name, :logoUrl, :details, :corporateWebsite,
                    :hrContactName, :hrContactEmail, :legalContactName, :legalContactEmail,
                    COALESCE(:status, 'ACTIVE'),
                    COALESCE(CAST(:createdAt AS timestamptz), now()), now())
                ON CONFLICT (id)
                DO UPDATE SET
                    name = EXCLUDED.name, logo_url = EXCLUDED.logo_url,
                    details = EXCLUDED.details, corporate_website = EXCLUDED.corporate_website,
                    hr_contact_name = EXCLUDED.hr_contact_name, hr_contact_email = EXCLUDED.hr_contact_email,
                    legal_contact_name = EXCLUDED.legal_contact_name, legal_contact_email = EXCLUDED.legal_contact_email,
                    status = EXCLUDED.status, updated_at = now()
                """.formatted(table);
        jdbcClient.sql(sql)
                .param("id", c.id())
                .param("userId", blankToNull(c.userId()))
                .param("name", c.name())
                .param("logoUrl", blankToNull(c.logoUrl()))
                .param("details", blankToNull(c.details()))
                .param("corporateWebsite", blankToNull(c.corporateWebsite()))
                .param("hrContactName", blankToNull(c.hrContactName()))
                .param("hrContactEmail", blankToNull(c.hrContactEmail()))
                .param("legalContactName", blankToNull(c.legalContactName()))
                .param("legalContactEmail", blankToNull(c.legalContactEmail()))
                .param("status", blankToNull(c.status()))
                .param("createdAt", blankToNull(c.createdAt()))
                .update();
    }

    public Company softDelete(String id) {
        validateUuid(id, "id");
        Company existing = findById(id);
        if (existing == null) return null;
        String sql = "UPDATE %s SET is_deleted = TRUE, deleted_at = now() WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE"
                .formatted(table);
        jdbcClient.sql(sql).param("id", id).update();
        return existing;
    }

    public Company disable(String id) {
        validateUuid(id, "id");
        Company existing = findById(id);
        if (existing == null) return null;

        // Mark company as DISABLED
        String sql = "UPDATE %s SET status = 'DISABLED', updated_at = now() WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE"
                .formatted(table);
        jdbcClient.sql(sql).param("id", id).update();

        // Close all OPEN jobs for this company
        jobService.closeJobsByCompanyId(id);

        return existing;
    }

    public Company enable(String id) {
        validateUuid(id, "id");
        Company existing = findById(id);
        if (existing == null) return null;
        String sql = "UPDATE %s SET status = 'ACTIVE', updated_at = now() WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE"
                .formatted(table);
        jdbcClient.sql(sql).param("id", id).update();
        return existing;
    }

    private long countActive() {
        return jdbcClient.sql("SELECT COUNT(*) FROM %s WHERE is_deleted = FALSE".formatted(table))
                .query(Long.class).single();
    }

    private long countAll() {
        return jdbcClient.sql("SELECT COUNT(*) FROM %s".formatted(table))
                .query(Long.class).single();
    }
}

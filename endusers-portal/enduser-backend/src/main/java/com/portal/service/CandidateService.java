package com.portal.service;

import com.portal.dto.Candidate;
import com.portal.dto.PageResponse;
import com.portal.util.TableNames;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.portal.util.ValidationUtil.*;

@Service
public class CandidateService {

    private final JdbcClient jdbcClient;
    private final String table = TableNames.CANDIDATES;

    public CandidateService(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    private static final String SELECT_COLUMNS = """
            CAST(id AS text) AS id, CAST(user_id AS text) AS user_id,
            name, email, phone, photo_url, portfolio_url, github_url, linkedin_url,
            current_company, current_title, CAST(working_since AS text) AS working_since,
            license, patents, certifications, status, is_deleted,
            CAST(deleted_at AS text) AS deleted_at,
            CAST(created_at AS text) AS created_at,
            CAST(updated_at AS text) AS updated_at
            """;

    public Candidate findById(String id) {
        validateUuid(id, "id");
        String sql = "SELECT %s FROM %s WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE"
                .formatted(SELECT_COLUMNS, table);
        return jdbcClient.sql(sql)
                .param("id", id)
                .query(Candidate.class)
                .optional().orElse(null);
    }

    public Candidate findByUserId(String userId) {
        validateUuid(userId, "userId");
        String sql = "SELECT %s FROM %s WHERE user_id = CAST(:userId AS uuid) AND is_deleted = FALSE"
                .formatted(SELECT_COLUMNS, table);
        return jdbcClient.sql(sql)
                .param("userId", userId)
                .query(Candidate.class)
                .optional().orElse(null);
    }

    public PageResponse<Candidate> listCandidates(int page, int size) {
        long total = countActive();
        String sql = "SELECT %s FROM %s WHERE is_deleted = FALSE ORDER BY created_at DESC LIMIT :size OFFSET :offset"
                .formatted(SELECT_COLUMNS, table);
        List<Candidate> list = jdbcClient.sql(sql)
                .param("size", size)
                .param("offset", page * size)
                .query(Candidate.class)
                .list();
        return PageResponse.of(list, page, size, total);
    }

    public PageResponse<Candidate> listAllIncludingDeleted(int page, int size) {
        long total = countAll();
        String sql = "SELECT %s FROM %s ORDER BY created_at DESC LIMIT :size OFFSET :offset"
                .formatted(SELECT_COLUMNS, table);
        List<Candidate> list = jdbcClient.sql(sql)
                .param("size", size)
                .param("offset", page * size)
                .query(Candidate.class)
                .list();
        return PageResponse.of(list, page, size, total);
    }

    public void upsert(Candidate c) {
        validateUuid(c.id(), "id");
        validateRequired(c.name(), "name");
        validateEmail(c.email());
        String sql = """
                INSERT INTO %s (id, user_id, name, email, phone, photo_url,
                    portfolio_url, github_url, linkedin_url,
                    current_company, current_title, working_since,
                    license, patents, certifications, status, created_at, updated_at)
                VALUES (CAST(:id AS uuid), CAST(:userId AS uuid), :name, :email, :phone, :photoUrl,
                    :portfolioUrl, :githubUrl, :linkedinUrl,
                    :currentCompany, :currentTitle, CAST(:workingSince AS date),
                    :license, :patents, :certifications,
                    COALESCE(:status, 'ACTIVE'),
                    COALESCE(CAST(:createdAt AS timestamptz), now()), now())
                ON CONFLICT (id)
                DO UPDATE SET
                    name = EXCLUDED.name, email = EXCLUDED.email, phone = EXCLUDED.phone,
                    photo_url = EXCLUDED.photo_url, portfolio_url = EXCLUDED.portfolio_url,
                    github_url = EXCLUDED.github_url, linkedin_url = EXCLUDED.linkedin_url,
                    current_company = EXCLUDED.current_company, current_title = EXCLUDED.current_title,
                    working_since = EXCLUDED.working_since, license = EXCLUDED.license,
                    patents = EXCLUDED.patents, certifications = EXCLUDED.certifications,
                    status = EXCLUDED.status, updated_at = now()
                """.formatted(table);
        jdbcClient.sql(sql)
                .param("id", c.id())
                .param("userId", blankToNull(c.userId()))
                .param("name", c.name())
                .param("email", c.email())
                .param("phone", blankToNull(c.phone()))
                .param("photoUrl", blankToNull(c.photoUrl()))
                .param("portfolioUrl", blankToNull(c.portfolioUrl()))
                .param("githubUrl", blankToNull(c.githubUrl()))
                .param("linkedinUrl", blankToNull(c.linkedinUrl()))
                .param("currentCompany", blankToNull(c.currentCompany()))
                .param("currentTitle", blankToNull(c.currentTitle()))
                .param("workingSince", blankToNull(c.workingSince()))
                .param("license", blankToNull(c.license()))
                .param("patents", blankToNull(c.patents()))
                .param("certifications", blankToNull(c.certifications()))
                .param("status", blankToNull(c.status()))
                .param("createdAt", blankToNull(c.createdAt()))
                .update();
    }

    public Candidate softDelete(String id) {
        validateUuid(id, "id");
        Candidate existing = findById(id);
        if (existing == null) return null;
        String sql = "UPDATE %s SET is_deleted = TRUE, deleted_at = now() WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE"
                .formatted(table);
        jdbcClient.sql(sql).param("id", id).update();
        return existing;
    }

    public Candidate disable(String id) {
        validateUuid(id, "id");
        Candidate existing = findById(id);
        if (existing == null) return null;
        String sql = "UPDATE %s SET status = 'DISABLED', updated_at = now() WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE"
                .formatted(table);
        jdbcClient.sql(sql).param("id", id).update();
        return existing;
    }

    public Candidate enable(String id) {
        validateUuid(id, "id");
        Candidate existing = findById(id);
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

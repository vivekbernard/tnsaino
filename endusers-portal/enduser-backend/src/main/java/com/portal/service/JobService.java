package com.portal.service;

import com.portal.dto.Company;
import com.portal.dto.Job;
import com.portal.dto.PageResponse;
import com.portal.util.TableNames;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.portal.util.ValidationUtil.*;

@Service
public class JobService {

    private final JdbcClient jdbcClient;
    private final String table = TableNames.JOBS;
    private final String companiesTable = TableNames.COMPANIES;

    public JobService(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    private static final String SELECT_COLUMNS = """
            CAST(id AS text) AS id, CAST(company_id AS text) AS company_id,
            company_name, title, job_description,
            required_professional_experience, required_educational_experience,
            status, applicant_count, is_deleted,
            CAST(deleted_at AS text) AS deleted_at,
            CAST(created_at AS text) AS created_at,
            CAST(updated_at AS text) AS updated_at
            """;

    public Job findById(String id) {
        validateUuid(id, "id");
        String sql = "SELECT %s FROM %s WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE"
                .formatted(SELECT_COLUMNS, table);
        return jdbcClient.sql(sql)
                .param("id", id)
                .query(Job.class)
                .optional().orElse(null);
    }

    public PageResponse<Job> listJobs(int page, int size, String companyId, String status) {
        StringBuilder where = new StringBuilder("WHERE is_deleted = FALSE");
        if (companyId != null && !companyId.isBlank()) {
            validateUuid(companyId, "companyId");
            where.append(" AND company_id = CAST(:companyId AS uuid)");
        }
        if (status != null && !status.isBlank()) {
            where.append(" AND status = :status");
        }

        String countSql = "SELECT COUNT(*) FROM %s %s".formatted(table, where);
        var countQuery = jdbcClient.sql(countSql);
        if (companyId != null && !companyId.isBlank()) countQuery = countQuery.param("companyId", companyId);
        if (status != null && !status.isBlank()) countQuery = countQuery.param("status", status);
        long total = countQuery.query(Long.class).single();

        String sql = "SELECT %s FROM %s %s ORDER BY created_at DESC LIMIT :size OFFSET :offset"
                .formatted(SELECT_COLUMNS, table, where);
        var query = jdbcClient.sql(sql);
        if (companyId != null && !companyId.isBlank()) query = query.param("companyId", companyId);
        if (status != null && !status.isBlank()) query = query.param("status", status);
        List<Job> list = query
                .param("size", size)
                .param("offset", page * size)
                .query(Job.class)
                .list();
        return PageResponse.of(list, page, size, total);
    }

    public PageResponse<Job> listAllIncludingDeleted(int page, int size) {
        long total = jdbcClient.sql("SELECT COUNT(*) FROM %s".formatted(table)).query(Long.class).single();
        String sql = "SELECT %s FROM %s ORDER BY created_at DESC LIMIT :size OFFSET :offset"
                .formatted(SELECT_COLUMNS, table);
        List<Job> list = jdbcClient.sql(sql)
                .param("size", size)
                .param("offset", page * size)
                .query(Job.class)
                .list();
        return PageResponse.of(list, page, size, total);
    }

    public Job createJob(Job job) {
        validateUuid(job.id(), "id");
        validateUuid(job.companyId(), "companyId");
        validateRequired(job.title(), "title");

        // Application-layer referential integrity: validate company exists, is active, not deleted
        String companySql = """
                SELECT CAST(id AS text) AS id, CAST(user_id AS text) AS user_id,
                       name, logo_url, details, corporate_website,
                       hr_contact_name, hr_contact_email, legal_contact_name, legal_contact_email,
                       status, is_deleted, CAST(deleted_at AS text) AS deleted_at,
                       CAST(created_at AS text) AS created_at, CAST(updated_at AS text) AS updated_at
                FROM %s WHERE id = CAST(:companyId AS uuid) AND is_deleted = FALSE
                """.formatted(companiesTable);
        Company company = jdbcClient.sql(companySql)
                .param("companyId", job.companyId())
                .query(Company.class)
                .optional().orElse(null);

        if (company == null) {
            throw new IllegalArgumentException("Company not found or has been deleted");
        }
        if (!"ACTIVE".equals(company.status())) {
            throw new IllegalArgumentException("Company is not active. Cannot create job.");
        }

        String sql = """
                INSERT INTO %s (id, company_id, company_name, title, job_description,
                    required_professional_experience, required_educational_experience,
                    status, applicant_count, created_at, updated_at)
                VALUES (CAST(:id AS uuid), CAST(:companyId AS uuid), :companyName, :title, :jobDescription,
                    :reqProfExp, :reqEduExp,
                    COALESCE(:status, 'OPEN'), 0,
                    COALESCE(CAST(:createdAt AS timestamptz), now()), now())
                ON CONFLICT (id)
                DO UPDATE SET
                    title = EXCLUDED.title, job_description = EXCLUDED.job_description,
                    required_professional_experience = EXCLUDED.required_professional_experience,
                    required_educational_experience = EXCLUDED.required_educational_experience,
                    status = EXCLUDED.status, updated_at = now()
                """.formatted(table);
        jdbcClient.sql(sql)
                .param("id", job.id())
                .param("companyId", job.companyId())
                .param("companyName", company.name())
                .param("title", job.title())
                .param("jobDescription", blankToNull(job.jobDescription()))
                .param("reqProfExp", blankToNull(job.requiredProfessionalExperience()))
                .param("reqEduExp", blankToNull(job.requiredEducationalExperience()))
                .param("status", blankToNull(job.status()))
                .param("createdAt", blankToNull(job.createdAt()))
                .update();
        return findById(job.id());
    }

    public Job softDelete(String id) {
        validateUuid(id, "id");
        Job existing = findById(id);
        if (existing == null) return null;
        String sql = "UPDATE %s SET is_deleted = TRUE, deleted_at = now() WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE"
                .formatted(table);
        jdbcClient.sql(sql).param("id", id).update();
        return existing;
    }

    public void closeJobsByCompanyId(String companyId) {
        validateUuid(companyId, "companyId");
        String sql = """
                UPDATE %s SET status = 'CLOSED', updated_at = now()
                WHERE company_id = CAST(:companyId AS uuid) AND status = 'OPEN' AND is_deleted = FALSE
                """.formatted(table);
        jdbcClient.sql(sql).param("companyId", companyId).update();
    }

    public void incrementApplicantCount(String jobId) {
        validateUuid(jobId, "jobId");
        String sql = "UPDATE %s SET applicant_count = applicant_count + 1, updated_at = now() WHERE id = CAST(:id AS uuid)"
                .formatted(table);
        jdbcClient.sql(sql).param("id", jobId).update();
    }
}

package com.portal.service;

import com.portal.dto.Candidate;
import com.portal.dto.Job;
import com.portal.dto.JobApplication;
import com.portal.dto.PageResponse;
import com.portal.util.TableNames;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.portal.util.ValidationUtil.*;

@Service
public class JobApplicationService {

    private final JdbcClient jdbcClient;
    private final JobService jobService;
    private final CandidateService candidateService;
    private final String table = TableNames.JOB_APPLICATIONS;

    public JobApplicationService(JdbcClient jdbcClient, JobService jobService, CandidateService candidateService) {
        this.jdbcClient = jdbcClient;
        this.jobService = jobService;
        this.candidateService = candidateService;
    }

    private static final String SELECT_COLUMNS = """
            CAST(id AS text) AS id, CAST(job_id AS text) AS job_id,
            CAST(candidate_id AS text) AS candidate_id,
            candidate_name, job_title, status,
            CAST(applied_at AS text) AS applied_at,
            is_deleted, CAST(deleted_at AS text) AS deleted_at
            """;

    public JobApplication findById(String id) {
        validateUuid(id, "id");
        String sql = "SELECT %s FROM %s WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE"
                .formatted(SELECT_COLUMNS, table);
        return jdbcClient.sql(sql)
                .param("id", id)
                .query(JobApplication.class)
                .optional().orElse(null);
    }

    public PageResponse<JobApplication> listByJobId(String jobId, int page, int size) {
        validateUuid(jobId, "jobId");
        long total = jdbcClient.sql("SELECT COUNT(*) FROM %s WHERE job_id = CAST(:jobId AS uuid) AND is_deleted = FALSE".formatted(table))
                .param("jobId", jobId).query(Long.class).single();
        String sql = "SELECT %s FROM %s WHERE job_id = CAST(:jobId AS uuid) AND is_deleted = FALSE ORDER BY applied_at DESC LIMIT :size OFFSET :offset"
                .formatted(SELECT_COLUMNS, table);
        List<JobApplication> list = jdbcClient.sql(sql)
                .param("jobId", jobId)
                .param("size", size)
                .param("offset", page * size)
                .query(JobApplication.class)
                .list();
        return PageResponse.of(list, page, size, total);
    }

    public PageResponse<JobApplication> listByCandidateId(String candidateId, int page, int size) {
        validateUuid(candidateId, "candidateId");
        long total = jdbcClient.sql("SELECT COUNT(*) FROM %s WHERE candidate_id = CAST(:candidateId AS uuid) AND is_deleted = FALSE".formatted(table))
                .param("candidateId", candidateId).query(Long.class).single();
        String sql = "SELECT %s FROM %s WHERE candidate_id = CAST(:candidateId AS uuid) AND is_deleted = FALSE ORDER BY applied_at DESC LIMIT :size OFFSET :offset"
                .formatted(SELECT_COLUMNS, table);
        List<JobApplication> list = jdbcClient.sql(sql)
                .param("candidateId", candidateId)
                .param("size", size)
                .param("offset", page * size)
                .query(JobApplication.class)
                .list();
        return PageResponse.of(list, page, size, total);
    }

    public JobApplication apply(JobApplication application) {
        validateUuid(application.id(), "id");
        validateUuid(application.jobId(), "jobId");
        validateUuid(application.candidateId(), "candidateId");

        // Application-layer referential integrity
        Candidate candidate = candidateService.findById(application.candidateId());
        if (candidate == null) {
            throw new IllegalArgumentException("Candidate not found or has been deleted");
        }
        if (!"ACTIVE".equals(candidate.status())) {
            throw new IllegalArgumentException("Candidate is disabled. Cannot apply.");
        }

        Job job = jobService.findById(application.jobId());
        if (job == null) {
            throw new IllegalArgumentException("Job not found or has been deleted");
        }
        if (!"OPEN".equals(job.status())) {
            throw new IllegalArgumentException("Job is not open for applications");
        }

        // Check for duplicate application
        String dupCheck = """
                SELECT COUNT(*) FROM %s
                WHERE job_id = CAST(:jobId AS uuid)
                AND candidate_id = CAST(:candidateId AS uuid)
                AND is_deleted = FALSE
                """.formatted(table);
        long existing = jdbcClient.sql(dupCheck)
                .param("jobId", application.jobId())
                .param("candidateId", application.candidateId())
                .query(Long.class).single();
        if (existing > 0) {
            throw new IllegalArgumentException("Candidate has already applied for this job");
        }

        String sql = """
                INSERT INTO %s (id, job_id, candidate_id, candidate_name, job_title, status, applied_at)
                VALUES (CAST(:id AS uuid), CAST(:jobId AS uuid), CAST(:candidateId AS uuid),
                        :candidateName, :jobTitle, 'APPLIED', now())
                """.formatted(table);
        jdbcClient.sql(sql)
                .param("id", application.id())
                .param("jobId", application.jobId())
                .param("candidateId", application.candidateId())
                .param("candidateName", candidate.name())
                .param("jobTitle", job.title())
                .update();

        // Atomically increment applicant count
        jobService.incrementApplicantCount(application.jobId());

        return findById(application.id());
    }

    public JobApplication updateStatus(String id, String newStatus) {
        validateUuid(id, "id");
        validateRequired(newStatus, "status");

        // Validate status value
        if (!List.of("APPLIED", "SHORTLISTED", "REJECTED", "HIRED").contains(newStatus)) {
            throw new IllegalArgumentException("Invalid status. Must be one of: APPLIED, SHORTLISTED, REJECTED, HIRED");
        }

        JobApplication existing = findById(id);
        if (existing == null) return null;

        String sql = "UPDATE %s SET status = :status WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE"
                .formatted(table);
        jdbcClient.sql(sql)
                .param("id", id)
                .param("status", newStatus)
                .update();
        return findById(id);
    }

    public JobApplication softDelete(String id) {
        validateUuid(id, "id");
        JobApplication existing = findById(id);
        if (existing == null) return null;
        String sql = "UPDATE %s SET is_deleted = TRUE, deleted_at = now() WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE"
                .formatted(table);
        jdbcClient.sql(sql).param("id", id).update();
        return existing;
    }
}

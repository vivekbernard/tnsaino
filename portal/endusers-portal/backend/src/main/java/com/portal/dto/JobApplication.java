package com.portal.dto;

public record JobApplication(
        String id,
        String jobId,
        String candidateId,
        String candidateName,
        String jobTitle,
        String status,
        String appliedAt,
        boolean isDeleted,
        String deletedAt
) {}

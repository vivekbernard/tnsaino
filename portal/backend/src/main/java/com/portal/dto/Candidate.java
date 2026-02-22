package com.portal.dto;

public record Candidate(
        String id,
        String userId,
        String name,
        String email,
        String phone,
        String photoUrl,
        String portfolioUrl,
        String githubUrl,
        String linkedinUrl,
        String currentCompany,
        String currentTitle,
        String workingSince,
        String license,
        String patents,
        String certifications,
        String status,
        boolean isDeleted,
        String deletedAt,
        String createdAt,
        String updatedAt
) {}

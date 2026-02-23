package com.portal.dto;

public record Job(
        String id,
        String companyId,
        String companyName,
        String title,
        String jobDescription,
        String requiredProfessionalExperience,
        String requiredEducationalExperience,
        String status,
        int applicantCount,
        boolean isDeleted,
        String deletedAt,
        String createdAt,
        String updatedAt
) {}

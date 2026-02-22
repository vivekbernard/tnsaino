package com.portal.dto;

public record Company(
        String id,
        String userId,
        String name,
        String logoUrl,
        String details,
        String corporateWebsite,
        String hrContactName,
        String hrContactEmail,
        String legalContactName,
        String legalContactEmail,
        String status,
        boolean isDeleted,
        String deletedAt,
        String createdAt,
        String updatedAt
) {}

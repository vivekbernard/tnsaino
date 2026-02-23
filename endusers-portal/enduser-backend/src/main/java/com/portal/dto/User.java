package com.portal.dto;

public record User(
        String id,
        String username,
        String passwordHash,
        String role,
        String linkedEntityId,
        String status,
        boolean isDeleted,
        String deletedAt,
        String createdAt
) {}

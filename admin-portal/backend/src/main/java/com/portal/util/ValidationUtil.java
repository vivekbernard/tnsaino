package com.portal.util;

import java.util.UUID;

public final class ValidationUtil {

    private ValidationUtil() {}

    public static void validateUuid(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Field '" + fieldName + "' must be a valid UUID");
        }
        try {
            UUID.fromString(value);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Field '" + fieldName + "' must be a valid UUID");
        }
    }

    public static void validateRequired(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("Field '" + fieldName + "' is required");
        }
    }

    public static void validateEmail(String value) {
        validateRequired(value, "email");
        if (!value.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new IllegalArgumentException("Field 'email' must be a valid email address");
        }
    }

    public static String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }
}

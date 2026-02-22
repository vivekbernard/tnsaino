package com.portal.service;

import com.portal.dto.PageResponse;
import com.portal.dto.User;
import com.portal.util.TableNames;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.portal.util.ValidationUtil.*;

@Service
public class UserService {

    private final JdbcClient jdbcClient;
    private final String table = TableNames.USERS;

    public UserService(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public User findById(String id) {
        validateUuid(id, "id");
        String sql = """
                SELECT CAST(id AS text) AS id, username, password_hash, role,
                       CAST(linked_entity_id AS text) AS linked_entity_id,
                       status, is_deleted, CAST(deleted_at AS text) AS deleted_at,
                       CAST(created_at AS text) AS created_at
                FROM %s WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE
                """.formatted(table);
        return jdbcClient.sql(sql)
                .param("id", id)
                .query(User.class)
                .optional().orElse(null);
    }

    public User findByUsername(String username) {
        validateRequired(username, "username");
        String sql = """
                SELECT CAST(id AS text) AS id, username, password_hash, role,
                       CAST(linked_entity_id AS text) AS linked_entity_id,
                       status, is_deleted, CAST(deleted_at AS text) AS deleted_at,
                       CAST(created_at AS text) AS created_at
                FROM %s WHERE username = :username AND is_deleted = FALSE
                """.formatted(table);
        return jdbcClient.sql(sql)
                .param("username", username)
                .query(User.class)
                .optional().orElse(null);
    }

    public PageResponse<User> listUsers(int page, int size) {
        long total = countActive();
        String sql = """
                SELECT CAST(id AS text) AS id, username, password_hash, role,
                       CAST(linked_entity_id AS text) AS linked_entity_id,
                       status, is_deleted, CAST(deleted_at AS text) AS deleted_at,
                       CAST(created_at AS text) AS created_at
                FROM %s WHERE is_deleted = FALSE
                ORDER BY created_at DESC
                LIMIT :size OFFSET :offset
                """.formatted(table);
        List<User> users = jdbcClient.sql(sql)
                .param("size", size)
                .param("offset", page * size)
                .query(User.class)
                .list();
        return PageResponse.of(users, page, size, total);
    }

    public void upsert(User user) {
        validateUuid(user.id(), "id");
        validateRequired(user.username(), "username");
        validateRequired(user.role(), "role");
        String sql = """
                INSERT INTO %s (id, username, password_hash, role, linked_entity_id, status, created_at)
                VALUES (CAST(:id AS uuid), :username, :passwordHash, :role,
                        CAST(:linkedEntityId AS uuid), COALESCE(:status, 'ACTIVE'),
                        COALESCE(CAST(:createdAt AS timestamptz), now()))
                ON CONFLICT (id)
                DO UPDATE SET
                    username = EXCLUDED.username,
                    password_hash = EXCLUDED.password_hash,
                    role = EXCLUDED.role,
                    linked_entity_id = EXCLUDED.linked_entity_id,
                    status = EXCLUDED.status
                """.formatted(table);
        jdbcClient.sql(sql)
                .param("id", user.id())
                .param("username", user.username())
                .param("passwordHash", blankToNull(user.passwordHash()))
                .param("role", user.role())
                .param("linkedEntityId", blankToNull(user.linkedEntityId()))
                .param("status", blankToNull(user.status()))
                .param("createdAt", blankToNull(user.createdAt()))
                .update();
    }

    public User softDelete(String id) {
        validateUuid(id, "id");
        User existing = findById(id);
        if (existing == null) return null;
        String sql = """
                UPDATE %s SET is_deleted = TRUE, deleted_at = now()
                WHERE id = CAST(:id AS uuid) AND is_deleted = FALSE
                """.formatted(table);
        jdbcClient.sql(sql).param("id", id).update();
        return existing;
    }

    private long countActive() {
        String sql = "SELECT COUNT(*) FROM %s WHERE is_deleted = FALSE".formatted(table);
        return jdbcClient.sql(sql).query(Long.class).single();
    }
}

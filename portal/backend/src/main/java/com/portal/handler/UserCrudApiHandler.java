package com.portal.handler;

import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.portal.dto.User;
import com.portal.service.UserService;
import com.portal.util.ApiGatewayRequestParser;
import com.portal.util.ApiResponseFactory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@Component
public class UserCrudApiHandler {

    private static final String ROUTE_PUT_USER = "PUT /api/user";
    private static final String ROUTE_GET_USER = "GET /api/user";
    private static final String ROUTE_GET_USER_LIST = "GET /api/userlist";
    private static final String ROUTE_DELETE_USER = "DELETE /api/user";

    private static final Set<String> HANDLED_ROUTES = Set.of(
            ROUTE_PUT_USER, ROUTE_GET_USER, ROUTE_GET_USER_LIST, ROUTE_DELETE_USER);

    private final UserService userService;
    private final ApiResponseFactory responseFactory;
    private final ApiGatewayRequestParser requestParser;

    public UserCrudApiHandler(UserService userService, ApiResponseFactory responseFactory, ApiGatewayRequestParser requestParser) {
        this.userService = userService;
        this.responseFactory = responseFactory;
        this.requestParser = requestParser;
    }

    public boolean canHandle(String method, String path) {
        return HANDLED_ROUTES.contains(routeKey(method, path));
    }

    public APIGatewayV2HTTPResponse handle(APIGatewayV2HTTPEvent event) {
        String path = requestParser.readPath(event);
        String method = requestParser.readMethod(event);
        String role = requestParser.readUserRole(event);

        return switch (routeKey(method, path)) {
            case ROUTE_PUT_USER -> handlePut(event);
            case ROUTE_GET_USER -> handleGet(event);
            case ROUTE_GET_USER_LIST -> {
                if (!"ADMIN".equals(role)) yield responseFactory.forbidden("Admin access required");
                yield handleList(event);
            }
            case ROUTE_DELETE_USER -> {
                if (!"ADMIN".equals(role)) yield responseFactory.forbidden("Admin access required");
                yield handleDelete(event);
            }
            default -> responseFactory.notFound("Route not found");
        };
    }

    private APIGatewayV2HTTPResponse handlePut(APIGatewayV2HTTPEvent event) {
        String body = requestParser.readBody(event);
        if (body == null || body.isBlank()) return responseFactory.badRequest("Body is required");
        try {
            User user = ApiResponseFactory.objectMapper().readValue(body, User.class);
            userService.upsert(user);
            return responseFactory.ok(Map.of("message", "User upserted", "user", user));
        } catch (JsonProcessingException e) {
            return responseFactory.badRequest("Invalid JSON body");
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    private APIGatewayV2HTTPResponse handleGet(APIGatewayV2HTTPEvent event) {
        String id = requestParser.readQueryParam(event, "id");
        if (id == null || id.isBlank()) return responseFactory.badRequest("Query parameter 'id' is required");
        try {
            User user = userService.findById(id);
            if (user == null) return responseFactory.notFound("User not found");
            return responseFactory.ok(user);
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    private APIGatewayV2HTTPResponse handleList(APIGatewayV2HTTPEvent event) {
        int page = requestParser.readIntQueryParam(event, "page", 0);
        int size = requestParser.readIntQueryParam(event, "size", 20);
        return responseFactory.ok(userService.listUsers(page, size));
    }

    private APIGatewayV2HTTPResponse handleDelete(APIGatewayV2HTTPEvent event) {
        String id = requestParser.readQueryParam(event, "id");
        if (id == null || id.isBlank()) return responseFactory.badRequest("Query parameter 'id' is required");
        try {
            User removed = userService.softDelete(id);
            if (removed == null) return responseFactory.notFound("User not found");
            return responseFactory.ok(Map.of("message", "User soft-deleted", "id", id));
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    private static String routeKey(String method, String path) {
        String safeMethod = method == null ? "" : method.toUpperCase();
        String safePath = path == null ? "" : path;
        return safeMethod + " " + safePath;
    }
}

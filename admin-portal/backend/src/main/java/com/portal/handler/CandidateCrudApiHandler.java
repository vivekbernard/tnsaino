package com.portal.handler;

import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.portal.dto.Candidate;
import com.portal.service.CandidateService;
import com.portal.util.ApiGatewayRequestParser;
import com.portal.util.ApiResponseFactory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@Component
public class CandidateCrudApiHandler {

    private static final String ROUTE_GET_CANDIDATE = "GET /api/candidate";
    private static final String ROUTE_GET_CANDIDATE_LIST = "GET /api/candidatelist";
    private static final String ROUTE_DELETE_CANDIDATE = "DELETE /api/candidate";
    private static final String ROUTE_PUT_DISABLE = "PUT /api/candidate/disable";
    private static final String ROUTE_PUT_ENABLE = "PUT /api/candidate/enable";

    private static final Set<String> HANDLED_ROUTES = Set.of(
            ROUTE_GET_CANDIDATE, ROUTE_GET_CANDIDATE_LIST,
            ROUTE_DELETE_CANDIDATE, ROUTE_PUT_DISABLE, ROUTE_PUT_ENABLE);

    private final CandidateService candidateService;
    private final ApiResponseFactory responseFactory;
    private final ApiGatewayRequestParser requestParser;

    public CandidateCrudApiHandler(CandidateService candidateService, ApiResponseFactory responseFactory, ApiGatewayRequestParser requestParser) {
        this.candidateService = candidateService;
        this.responseFactory = responseFactory;
        this.requestParser = requestParser;
    }

    public boolean canHandle(String method, String path) {
        return HANDLED_ROUTES.contains(routeKey(method, path));
    }

    public APIGatewayV2HTTPResponse handle(APIGatewayV2HTTPEvent event) {
        String path = requestParser.readPath(event);
        String method = requestParser.readMethod(event);

        return switch (routeKey(method, path)) {
            case ROUTE_GET_CANDIDATE -> handleGet(event);
            case ROUTE_GET_CANDIDATE_LIST -> handleList(event);
            case ROUTE_DELETE_CANDIDATE -> handleDelete(event);
            case ROUTE_PUT_DISABLE -> handleDisable(event);
            case ROUTE_PUT_ENABLE -> handleEnable(event);
            default -> responseFactory.notFound("Route not found");
        };
    }

    private APIGatewayV2HTTPResponse handleGet(APIGatewayV2HTTPEvent event) {
        String id = requestParser.readQueryParam(event, "id");
        if (id == null || id.isBlank()) return responseFactory.badRequest("Query parameter 'id' is required");
        try {
            Candidate candidate = candidateService.findById(id);
            if (candidate == null) return responseFactory.notFound("Candidate not found");
            return responseFactory.ok(candidate);
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    private APIGatewayV2HTTPResponse handleList(APIGatewayV2HTTPEvent event) {
        int page = requestParser.readIntQueryParam(event, "page", 0);
        int size = requestParser.readIntQueryParam(event, "size", 20);
        String includeDeleted = requestParser.readQueryParam(event, "includeDeleted");
        if ("true".equals(includeDeleted)) {
            return responseFactory.ok(candidateService.listAllIncludingDeleted(page, size));
        }
        return responseFactory.ok(candidateService.listCandidates(page, size));
    }

    private APIGatewayV2HTTPResponse handleDelete(APIGatewayV2HTTPEvent event) {
        String id = requestParser.readQueryParam(event, "id");
        if (id == null || id.isBlank()) return responseFactory.badRequest("Query parameter 'id' is required");
        try {
            Candidate removed = candidateService.softDelete(id);
            if (removed == null) return responseFactory.notFound("Candidate not found");
            return responseFactory.ok(Map.of("message", "Candidate soft-deleted", "id", id));
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    private APIGatewayV2HTTPResponse handleDisable(APIGatewayV2HTTPEvent event) {
        String id = requestParser.readQueryParam(event, "id");
        if (id == null || id.isBlank()) return responseFactory.badRequest("Query parameter 'id' is required");
        try {
            Candidate result = candidateService.disable(id);
            if (result == null) return responseFactory.notFound("Candidate not found");
            return responseFactory.ok(Map.of("message", "Candidate disabled", "id", id));
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    private APIGatewayV2HTTPResponse handleEnable(APIGatewayV2HTTPEvent event) {
        String id = requestParser.readQueryParam(event, "id");
        if (id == null || id.isBlank()) return responseFactory.badRequest("Query parameter 'id' is required");
        try {
            Candidate result = candidateService.enable(id);
            if (result == null) return responseFactory.notFound("Candidate not found");
            return responseFactory.ok(Map.of("message", "Candidate enabled", "id", id));
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

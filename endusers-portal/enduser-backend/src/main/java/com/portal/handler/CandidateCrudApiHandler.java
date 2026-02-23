package com.portal.handler;

import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.portal.dto.Candidate;
import com.portal.service.CandidateService;
import com.portal.util.ApiGatewayRequestParser;
import com.portal.util.ApiResponseFactory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@Component
public class CandidateCrudApiHandler {

    private static final String ROUTE_PUT_CANDIDATE = "PUT /api/candidate";
    private static final String ROUTE_GET_CANDIDATE = "GET /api/candidate";

    private static final Set<String> HANDLED_ROUTES = Set.of(ROUTE_PUT_CANDIDATE, ROUTE_GET_CANDIDATE);

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
        String role = requestParser.readUserRole(event);

        return switch (routeKey(method, path)) {
            case ROUTE_PUT_CANDIDATE -> {
                if (!"CANDIDATE".equals(role))
                    yield responseFactory.forbidden("Candidate access required");
                yield handlePut(event);
            }
            case ROUTE_GET_CANDIDATE -> handleGet(event);
            default -> responseFactory.notFound("Route not found");
        };
    }

    private APIGatewayV2HTTPResponse handlePut(APIGatewayV2HTTPEvent event) {
        String body = requestParser.readBody(event);
        if (body == null || body.isBlank()) return responseFactory.badRequest("Body is required");
        try {
            Candidate candidate = ApiResponseFactory.objectMapper().readValue(body, Candidate.class);
            candidateService.upsert(candidate);
            return responseFactory.ok(Map.of("message", "Candidate upserted", "candidate", candidate));
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
            Candidate candidate = candidateService.findById(id);
            if (candidate == null) return responseFactory.notFound("Candidate not found");
            return responseFactory.ok(candidate);
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

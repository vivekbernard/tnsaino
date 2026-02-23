package com.portal.handler;

import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.portal.dto.JobApplication;
import com.portal.service.JobApplicationService;
import com.portal.util.ApiGatewayRequestParser;
import com.portal.util.ApiResponseFactory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@Component
public class JobApplicationCrudApiHandler {

    private static final String ROUTE_GET_APPLICATION = "GET /api/jobapplication";
    private static final String ROUTE_GET_APPLICATION_LIST = "GET /api/jobapplicationlist";
    private static final String ROUTE_DELETE_APPLICATION = "DELETE /api/jobapplication";

    private static final Set<String> HANDLED_ROUTES = Set.of(
            ROUTE_GET_APPLICATION, ROUTE_GET_APPLICATION_LIST, ROUTE_DELETE_APPLICATION);

    private final JobApplicationService applicationService;
    private final ApiResponseFactory responseFactory;
    private final ApiGatewayRequestParser requestParser;

    public JobApplicationCrudApiHandler(JobApplicationService applicationService, ApiResponseFactory responseFactory, ApiGatewayRequestParser requestParser) {
        this.applicationService = applicationService;
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
            case ROUTE_GET_APPLICATION -> handleGet(event);
            case ROUTE_GET_APPLICATION_LIST -> handleList(event);
            case ROUTE_DELETE_APPLICATION -> handleDelete(event);
            default -> responseFactory.notFound("Route not found");
        };
    }

    private APIGatewayV2HTTPResponse handleGet(APIGatewayV2HTTPEvent event) {
        String id = requestParser.readQueryParam(event, "id");
        if (id == null || id.isBlank()) return responseFactory.badRequest("Query parameter 'id' is required");
        try {
            JobApplication app = applicationService.findById(id);
            if (app == null) return responseFactory.notFound("Application not found");
            return responseFactory.ok(app);
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    private APIGatewayV2HTTPResponse handleList(APIGatewayV2HTTPEvent event) {
        int page = requestParser.readIntQueryParam(event, "page", 0);
        int size = requestParser.readIntQueryParam(event, "size", 20);
        String jobId = requestParser.readQueryParam(event, "jobId");
        String candidateId = requestParser.readQueryParam(event, "candidateId");

        if (jobId != null && !jobId.isBlank()) {
            return responseFactory.ok(applicationService.listByJobId(jobId, page, size));
        }
        if (candidateId != null && !candidateId.isBlank()) {
            return responseFactory.ok(applicationService.listByCandidateId(candidateId, page, size));
        }
        return responseFactory.badRequest("Query parameter 'jobId' or 'candidateId' is required");
    }

    private APIGatewayV2HTTPResponse handleDelete(APIGatewayV2HTTPEvent event) {
        String id = requestParser.readQueryParam(event, "id");
        if (id == null || id.isBlank()) return responseFactory.badRequest("Query parameter 'id' is required");
        try {
            JobApplication removed = applicationService.softDelete(id);
            if (removed == null) return responseFactory.notFound("Application not found");
            return responseFactory.ok(Map.of("message", "Application soft-deleted", "id", id));
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

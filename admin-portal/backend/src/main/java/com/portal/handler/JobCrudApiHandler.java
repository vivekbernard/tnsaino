package com.portal.handler;

import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.portal.dto.Job;
import com.portal.service.JobService;
import com.portal.util.ApiGatewayRequestParser;
import com.portal.util.ApiResponseFactory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@Component
public class JobCrudApiHandler {

    private static final String ROUTE_GET_JOB = "GET /api/job";
    private static final String ROUTE_GET_JOB_LIST = "GET /api/joblist";
    private static final String ROUTE_PUT_JOB = "PUT /api/job";
    private static final String ROUTE_DELETE_JOB = "DELETE /api/job";

    private static final Set<String> HANDLED_ROUTES = Set.of(ROUTE_GET_JOB, ROUTE_GET_JOB_LIST, ROUTE_PUT_JOB, ROUTE_DELETE_JOB);

    private final JobService jobService;
    private final ApiResponseFactory responseFactory;
    private final ApiGatewayRequestParser requestParser;

    public JobCrudApiHandler(JobService jobService, ApiResponseFactory responseFactory, ApiGatewayRequestParser requestParser) {
        this.jobService = jobService;
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
            case ROUTE_GET_JOB -> handleGet(event);
            case ROUTE_GET_JOB_LIST -> handleList(event);
            case ROUTE_PUT_JOB -> handlePut(event);
            case ROUTE_DELETE_JOB -> handleDelete(event);
            default -> responseFactory.notFound("Route not found");
        };
    }

    private APIGatewayV2HTTPResponse handleGet(APIGatewayV2HTTPEvent event) {
        String id = requestParser.readQueryParam(event, "id");
        if (id == null || id.isBlank()) return responseFactory.badRequest("Query parameter 'id' is required");
        try {
            Job job = jobService.findById(id);
            if (job == null) return responseFactory.notFound("Job not found");
            return responseFactory.ok(job);
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    private APIGatewayV2HTTPResponse handleList(APIGatewayV2HTTPEvent event) {
        int page = requestParser.readIntQueryParam(event, "page", 0);
        int size = requestParser.readIntQueryParam(event, "size", 20);
        String companyId = requestParser.readQueryParam(event, "companyId");
        String status = requestParser.readQueryParam(event, "status");
        String includeDeleted = requestParser.readQueryParam(event, "includeDeleted");

        if ("true".equals(includeDeleted)) {
            return responseFactory.ok(jobService.listAllIncludingDeleted(page, size));
        }
        return responseFactory.ok(jobService.listJobs(page, size, companyId, status));
    }

    private APIGatewayV2HTTPResponse handlePut(APIGatewayV2HTTPEvent event) {
        String body = requestParser.readBody(event);
        if (body == null || body.isBlank()) return responseFactory.badRequest("Body is required");
        try {
            Job job = ApiResponseFactory.objectMapper().readValue(body, Job.class);
            jobService.updateJob(job);
            return responseFactory.ok(Map.of("message", "Job updated", "job", job));
        } catch (JsonProcessingException e) {
            return responseFactory.badRequest("Invalid JSON body");
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    private APIGatewayV2HTTPResponse handleDelete(APIGatewayV2HTTPEvent event) {
        String id = requestParser.readQueryParam(event, "id");
        if (id == null || id.isBlank()) return responseFactory.badRequest("Query parameter 'id' is required");
        try {
            Job removed = jobService.softDelete(id);
            if (removed == null) return responseFactory.notFound("Job not found");
            return responseFactory.ok(Map.of("message", "Job soft-deleted", "id", id));
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

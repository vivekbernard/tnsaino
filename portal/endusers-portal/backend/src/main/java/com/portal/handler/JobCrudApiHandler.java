package com.portal.handler;

import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.portal.dto.Company;
import com.portal.dto.Job;
import com.portal.service.CompanyService;
import com.portal.service.JobService;
import com.portal.util.ApiGatewayRequestParser;
import com.portal.util.ApiResponseFactory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@Component
public class JobCrudApiHandler {

    private static final String ROUTE_PUT_JOB = "PUT /api/job";
    private static final String ROUTE_GET_JOB = "GET /api/job";
    private static final String ROUTE_GET_JOB_LIST = "GET /api/joblist";

    private static final Set<String> HANDLED_ROUTES = Set.of(ROUTE_PUT_JOB, ROUTE_GET_JOB, ROUTE_GET_JOB_LIST);

    private final JobService jobService;
    private final CompanyService companyService;
    private final ApiResponseFactory responseFactory;
    private final ApiGatewayRequestParser requestParser;

    public JobCrudApiHandler(JobService jobService, CompanyService companyService,
                             ApiResponseFactory responseFactory, ApiGatewayRequestParser requestParser) {
        this.jobService = jobService;
        this.companyService = companyService;
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
            case ROUTE_PUT_JOB -> {
                if (!"COMPANY".equals(role))
                    yield responseFactory.forbidden("Company access required");
                yield handlePut(event);
            }
            case ROUTE_GET_JOB -> handleGet(event);
            case ROUTE_GET_JOB_LIST -> handleList(event);
            default -> responseFactory.notFound("Route not found");
        };
    }

    private APIGatewayV2HTTPResponse handlePut(APIGatewayV2HTTPEvent event) {
        String body = requestParser.readBody(event);
        if (body == null || body.isBlank()) return responseFactory.badRequest("Body is required");
        try {
            Job job = ApiResponseFactory.objectMapper().readValue(body, Job.class);
            Job created = jobService.createJob(job);
            return responseFactory.ok(Map.of("message", "Job created/updated", "job", created));
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
        String status = requestParser.readQueryParam(event, "status");
        String role = requestParser.readUserRole(event);

        String companyId;
        if ("COMPANY".equals(role)) {
            String callerSub = requestParser.readUserId(event);
            if (callerSub == null || callerSub.isBlank())
                return responseFactory.forbidden("Unable to identify caller");
            Company company = companyService.findByUserId(callerSub);
            if (company == null)
                return responseFactory.notFound("Company profile not found");
            companyId = company.id();
        } else {
            companyId = requestParser.readQueryParam(event, "companyId");
        }

        return responseFactory.ok(jobService.listJobs(page, size, companyId, status));
    }

    private static String routeKey(String method, String path) {
        String safeMethod = method == null ? "" : method.toUpperCase();
        String safePath = path == null ? "" : path;
        return safeMethod + " " + safePath;
    }
}

package com.portal.handler;

import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.portal.dto.Company;
import com.portal.service.CompanyService;
import com.portal.util.ApiGatewayRequestParser;
import com.portal.util.ApiResponseFactory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@Component
public class CompanyCrudApiHandler {

    private static final String ROUTE_GET_COMPANY = "GET /api/company";
    private static final String ROUTE_GET_COMPANY_LIST = "GET /api/companylist";
    private static final String ROUTE_DELETE_COMPANY = "DELETE /api/company";
    private static final String ROUTE_PUT_COMPANY = "PUT /api/company";
    private static final String ROUTE_PUT_DISABLE = "PUT /api/company/disable";
    private static final String ROUTE_PUT_ENABLE = "PUT /api/company/enable";

    private static final Set<String> HANDLED_ROUTES = Set.of(
            ROUTE_GET_COMPANY, ROUTE_GET_COMPANY_LIST,
            ROUTE_DELETE_COMPANY, ROUTE_PUT_COMPANY, ROUTE_PUT_DISABLE, ROUTE_PUT_ENABLE);

    private final CompanyService companyService;
    private final ApiResponseFactory responseFactory;
    private final ApiGatewayRequestParser requestParser;

    public CompanyCrudApiHandler(CompanyService companyService, ApiResponseFactory responseFactory, ApiGatewayRequestParser requestParser) {
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

        return switch (routeKey(method, path)) {
            case ROUTE_GET_COMPANY -> handleGet(event);
            case ROUTE_GET_COMPANY_LIST -> handleList(event);
            case ROUTE_DELETE_COMPANY -> handleDelete(event);
            case ROUTE_PUT_COMPANY -> handlePut(event);
            case ROUTE_PUT_DISABLE -> handleDisable(event);
            case ROUTE_PUT_ENABLE -> handleEnable(event);
            default -> responseFactory.notFound("Route not found");
        };
    }

    private APIGatewayV2HTTPResponse handleGet(APIGatewayV2HTTPEvent event) {
        String id = requestParser.readQueryParam(event, "id");
        if (id == null || id.isBlank()) return responseFactory.badRequest("Query parameter 'id' is required");
        try {
            Company company = companyService.findById(id);
            if (company == null) return responseFactory.notFound("Company not found");
            return responseFactory.ok(company);
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    private APIGatewayV2HTTPResponse handleList(APIGatewayV2HTTPEvent event) {
        int page = requestParser.readIntQueryParam(event, "page", 0);
        int size = requestParser.readIntQueryParam(event, "size", 20);
        String includeDeleted = requestParser.readQueryParam(event, "includeDeleted");
        if ("true".equals(includeDeleted)) {
            return responseFactory.ok(companyService.listAllIncludingDeleted(page, size));
        }
        return responseFactory.ok(companyService.listCompanies(page, size));
    }

    private APIGatewayV2HTTPResponse handlePut(APIGatewayV2HTTPEvent event) {
        String body = requestParser.readBody(event);
        if (body == null || body.isBlank()) return responseFactory.badRequest("Body is required");
        try {
            Company company = ApiResponseFactory.objectMapper().readValue(body, Company.class);
            companyService.upsert(company);
            return responseFactory.ok(Map.of("message", "Company updated", "company", company));
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
            Company removed = companyService.softDelete(id);
            if (removed == null) return responseFactory.notFound("Company not found");
            return responseFactory.ok(Map.of("message", "Company soft-deleted", "id", id));
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    private APIGatewayV2HTTPResponse handleDisable(APIGatewayV2HTTPEvent event) {
        String id = requestParser.readQueryParam(event, "id");
        if (id == null || id.isBlank()) return responseFactory.badRequest("Query parameter 'id' is required");
        try {
            Company result = companyService.disable(id);
            if (result == null) return responseFactory.notFound("Company not found");
            return responseFactory.ok(Map.of("message", "Company disabled and all open jobs closed", "id", id));
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    private APIGatewayV2HTTPResponse handleEnable(APIGatewayV2HTTPEvent event) {
        String id = requestParser.readQueryParam(event, "id");
        if (id == null || id.isBlank()) return responseFactory.badRequest("Query parameter 'id' is required");
        try {
            Company result = companyService.enable(id);
            if (result == null) return responseFactory.notFound("Company not found");
            return responseFactory.ok(Map.of("message", "Company enabled", "id", id));
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

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

    private static final String ROUTE_PUT_COMPANY = "PUT /api/company";
    private static final String ROUTE_GET_COMPANY = "GET /api/company";

    private static final Set<String> HANDLED_ROUTES = Set.of(ROUTE_PUT_COMPANY, ROUTE_GET_COMPANY);

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
        String role = requestParser.readUserRole(event);

        return switch (routeKey(method, path)) {
            case ROUTE_PUT_COMPANY -> {
                if (!"COMPANY".equals(role))
                    yield responseFactory.forbidden("Company access required");
                yield handlePut(event);
            }
            case ROUTE_GET_COMPANY -> handleGet(event);
            default -> responseFactory.notFound("Route not found");
        };
    }

    private APIGatewayV2HTTPResponse handlePut(APIGatewayV2HTTPEvent event) {
        String body = requestParser.readBody(event);
        if (body == null || body.isBlank()) return responseFactory.badRequest("Body is required");
        try {
            Company company = ApiResponseFactory.objectMapper().readValue(body, Company.class);
            companyService.upsert(company);
            return responseFactory.ok(Map.of("message", "Company upserted", "company", company));
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
            Company company = companyService.findById(id);
            if (company == null) return responseFactory.notFound("Company not found");
            return responseFactory.ok(company);
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

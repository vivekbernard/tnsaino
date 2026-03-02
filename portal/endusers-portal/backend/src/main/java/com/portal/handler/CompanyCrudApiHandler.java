package com.portal.handler;

import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.portal.dto.Company;
import com.portal.service.CompanyService;
import com.portal.service.PhotoPresignService;
import com.portal.util.ApiGatewayRequestParser;
import com.portal.util.ApiResponseFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@Component
public class CompanyCrudApiHandler {

    private static final Logger log = LoggerFactory.getLogger(CompanyCrudApiHandler.class);
    private static final String ROLE_COMPANY = "COMPANY";
    private static final String MSG_COMPANY_REQUIRED = "Company access required";
    private static final String MSG_UNABLE_TO_IDENTIFY = "Unable to identify caller";

    private static final String ROUTE_PUT_COMPANY = "PUT /api/company";
    private static final String ROUTE_GET_COMPANY = "GET /api/company";
    private static final String ROUTE_GET_LOGO_UPLOAD = "GET /api/company/logo/upload-url";
    private static final String ROUTE_GET_LOGO_DOWNLOAD = "GET /api/company/logo/download-url";

    private static final Set<String> HANDLED_ROUTES = Set.of(
            ROUTE_PUT_COMPANY, ROUTE_GET_COMPANY,
            ROUTE_GET_LOGO_UPLOAD, ROUTE_GET_LOGO_DOWNLOAD);

    private final CompanyService companyService;
    private final PhotoPresignService photoPresignService;
    private final ApiResponseFactory responseFactory;
    private final ApiGatewayRequestParser requestParser;

    public CompanyCrudApiHandler(CompanyService companyService, PhotoPresignService photoPresignService,
                                 ApiResponseFactory responseFactory, ApiGatewayRequestParser requestParser) {
        this.companyService = companyService;
        this.photoPresignService = photoPresignService;
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
                if (!ROLE_COMPANY.equals(role))
                    yield responseFactory.forbidden(MSG_COMPANY_REQUIRED);
                yield handlePut(event);
            }
            case ROUTE_GET_COMPANY -> handleGet(event);
            case ROUTE_GET_LOGO_UPLOAD -> {
                if (!ROLE_COMPANY.equals(role))
                    yield responseFactory.forbidden(MSG_COMPANY_REQUIRED);
                yield handleLogoUploadUrl(event);
            }
            case ROUTE_GET_LOGO_DOWNLOAD -> {
                if (!ROLE_COMPANY.equals(role))
                    yield responseFactory.forbidden(MSG_COMPANY_REQUIRED);
                yield handleLogoDownloadUrl(event);
            }
            default -> responseFactory.notFound("Route not found");
        };
    }

    private APIGatewayV2HTTPResponse handlePut(APIGatewayV2HTTPEvent event) {
        String body = requestParser.readBody(event);
        if (body == null || body.isBlank()) return responseFactory.badRequest("Body is required");
        try {
            Company company = ApiResponseFactory.objectMapper().readValue(body, Company.class);
            String callerSub = requestParser.readUserId(event);
            if (callerSub == null || callerSub.isBlank())
                return responseFactory.forbidden(MSG_UNABLE_TO_IDENTIFY);
            if (company.userId() == null || !callerSub.equals(company.userId()))
                return responseFactory.forbidden("You can only create or update your own company profile");
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
        String userId = requestParser.readQueryParam(event, "userId");
        if ((id == null || id.isBlank()) && (userId == null || userId.isBlank()))
            return responseFactory.badRequest("Query parameter 'id' or 'userId' is required");
        try {
            Company company;
            if (id != null && !id.isBlank()) {
                company = companyService.findById(id);
            } else {
                // userId lookup: caller may only look up their own company profile this way
                String callerSub = requestParser.readUserId(event);
                if (callerSub == null || !callerSub.equals(userId))
                    return responseFactory.forbidden("You can only access your own company profile this way");
                company = companyService.findByUserId(userId);
            }
            if (company == null) return responseFactory.notFound("Company not found");
            return responseFactory.ok(company);
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    private APIGatewayV2HTTPResponse handleLogoUploadUrl(APIGatewayV2HTTPEvent event) {
        String callerSub = requestParser.readUserId(event);
        if (callerSub == null || callerSub.isBlank())
            return responseFactory.forbidden(MSG_UNABLE_TO_IDENTIFY);
        String contentType = requestParser.readQueryParam(event, "contentType");
        if (contentType == null || contentType.isBlank()) contentType = "image/jpeg";
        try {
            String uploadUrl = photoPresignService.generateLogoUploadUrl(callerSub, contentType);
            return responseFactory.ok(Map.of("uploadUrl", uploadUrl, "key", "companies/" + callerSub + "/logo"));
        } catch (Exception e) {
            log.error("Failed to generate logo upload URL for user '{}'", callerSub, e);
            return responseFactory.serverError("Failed to generate upload URL");
        }
    }

    private APIGatewayV2HTTPResponse handleLogoDownloadUrl(APIGatewayV2HTTPEvent event) {
        String callerSub = requestParser.readUserId(event);
        if (callerSub == null || callerSub.isBlank())
            return responseFactory.forbidden(MSG_UNABLE_TO_IDENTIFY);
        try {
            if (!photoPresignService.logoExists(callerSub))
                return responseFactory.notFound("No logo uploaded");
            String downloadUrl = photoPresignService.generateLogoDownloadUrl(callerSub);
            return responseFactory.ok(Map.of("downloadUrl", downloadUrl));
        } catch (Exception e) {
            log.error("Failed to generate logo download URL for user '{}'", callerSub, e);
            return responseFactory.serverError("Failed to generate download URL");
        }
    }

    private static String routeKey(String method, String path) {
        String safeMethod = method == null ? "" : method.toUpperCase();
        String safePath = path == null ? "" : path;
        return safeMethod + " " + safePath;
    }
}

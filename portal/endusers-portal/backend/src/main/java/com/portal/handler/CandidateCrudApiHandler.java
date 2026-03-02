package com.portal.handler;

import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.portal.dto.Candidate;
import com.portal.service.CandidateService;
import com.portal.service.PhotoPresignService;
import com.portal.util.ApiGatewayRequestParser;
import com.portal.util.ApiResponseFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@Component
public class CandidateCrudApiHandler {

    private static final Logger log = LoggerFactory.getLogger(CandidateCrudApiHandler.class);
    private static final String ROLE_CANDIDATE = "CANDIDATE";
    private static final String MSG_CANDIDATE_REQUIRED = "Candidate access required";
    private static final String MSG_UNABLE_TO_IDENTIFY = "Unable to identify caller";
    private static final String MSG_OWN_PROFILE_ONLY = "You can only access your own profile";

    private static final String ROUTE_PUT_CANDIDATE = "PUT /api/candidate";
    private static final String ROUTE_GET_CANDIDATE = "GET /api/candidate";
    private static final String ROUTE_GET_PHOTO_UPLOAD = "GET /api/candidate/photo/upload-url";
    private static final String ROUTE_GET_PHOTO_DOWNLOAD = "GET /api/candidate/photo/download-url";

    private static final Set<String> HANDLED_ROUTES = Set.of(
            ROUTE_PUT_CANDIDATE, ROUTE_GET_CANDIDATE,
            ROUTE_GET_PHOTO_UPLOAD, ROUTE_GET_PHOTO_DOWNLOAD);

    private final CandidateService candidateService;
    private final PhotoPresignService photoPresignService;
    private final ApiResponseFactory responseFactory;
    private final ApiGatewayRequestParser requestParser;

    public CandidateCrudApiHandler(CandidateService candidateService, PhotoPresignService photoPresignService,
                                   ApiResponseFactory responseFactory, ApiGatewayRequestParser requestParser) {
        this.candidateService = candidateService;
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
            case ROUTE_PUT_CANDIDATE -> {
                if (!ROLE_CANDIDATE.equals(role))
                    yield responseFactory.forbidden(MSG_CANDIDATE_REQUIRED);
                yield handlePut(event);
            }
            case ROUTE_GET_CANDIDATE -> handleGet(event);
            case ROUTE_GET_PHOTO_UPLOAD -> {
                if (!ROLE_CANDIDATE.equals(role))
                    yield responseFactory.forbidden(MSG_CANDIDATE_REQUIRED);
                yield handlePhotoUploadUrl(event);
            }
            case ROUTE_GET_PHOTO_DOWNLOAD -> {
                if (!ROLE_CANDIDATE.equals(role))
                    yield responseFactory.forbidden(MSG_CANDIDATE_REQUIRED);
                yield handlePhotoDownloadUrl(event);
            }
            default -> responseFactory.notFound("Route not found");
        };
    }

    private APIGatewayV2HTTPResponse handlePut(APIGatewayV2HTTPEvent event) {
        String body = requestParser.readBody(event);
        if (body == null || body.isBlank()) return responseFactory.badRequest("Body is required");
        try {
            Candidate candidate = ApiResponseFactory.objectMapper().readValue(body, Candidate.class);
            String callerSub = requestParser.readUserId(event);
            if (callerSub == null || callerSub.isBlank())
                return responseFactory.forbidden(MSG_UNABLE_TO_IDENTIFY);
            if (candidate.userId() == null || !callerSub.equals(candidate.userId()))
                return responseFactory.forbidden("You can only create or update your own candidate profile");
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
        String userId = requestParser.readQueryParam(event, "userId");
        if ((id == null || id.isBlank()) && (userId == null || userId.isBlank()))
            return responseFactory.badRequest("Query parameter 'id' or 'userId' is required");
        String role = requestParser.readUserRole(event);
        String callerSub = requestParser.readUserId(event);
        try {
            Candidate candidate;
            if (userId != null && !userId.isBlank()) {
                if (!isCandidateAccessAllowed(role, callerSub, userId))
                    return responseFactory.forbidden(MSG_OWN_PROFILE_ONLY);
                candidate = candidateService.findByUserId(userId);
            } else {
                candidate = candidateService.findById(id);
                if (candidate != null && !isCandidateAccessAllowed(role, callerSub, candidate.userId()))
                    return responseFactory.forbidden(MSG_OWN_PROFILE_ONLY);
            }
            if (candidate == null) return responseFactory.notFound("Candidate not found");
            return responseFactory.ok(candidate);
        } catch (IllegalArgumentException e) {
            return responseFactory.badRequest(e.getMessage());
        }
    }

    /**
     * Returns true if the caller is allowed to read the candidate profile owned by ownerSub.
     * CANDIDATE role is restricted to their own profile; all other roles (e.g. COMPANY) are unrestricted.
     */
    private static boolean isCandidateAccessAllowed(String role, String callerSub, String ownerSub) {
        return !ROLE_CANDIDATE.equals(role) || (callerSub != null && callerSub.equals(ownerSub));
    }

    private APIGatewayV2HTTPResponse handlePhotoUploadUrl(APIGatewayV2HTTPEvent event) {
        String callerSub = requestParser.readUserId(event);
        if (callerSub == null || callerSub.isBlank())
            return responseFactory.forbidden(MSG_UNABLE_TO_IDENTIFY);
        String contentType = requestParser.readQueryParam(event, "contentType");
        if (contentType == null || contentType.isBlank()) contentType = "image/jpeg";
        try {
            String uploadUrl = photoPresignService.generateUploadUrl(callerSub, contentType);
            return responseFactory.ok(Map.of("uploadUrl", uploadUrl, "key", "candidates/" + callerSub + "/photo"));
        } catch (Exception e) {
            log.error("Failed to generate photo upload URL for user '{}'", callerSub, e);
            return responseFactory.serverError("Failed to generate upload URL");
        }
    }

    private APIGatewayV2HTTPResponse handlePhotoDownloadUrl(APIGatewayV2HTTPEvent event) {
        String callerSub = requestParser.readUserId(event);
        if (callerSub == null || callerSub.isBlank())
            return responseFactory.forbidden(MSG_UNABLE_TO_IDENTIFY);
        try {
            if (!photoPresignService.photoExists(callerSub))
                return responseFactory.notFound("No photo uploaded");
            String downloadUrl = photoPresignService.generateDownloadUrl(callerSub);
            return responseFactory.ok(Map.of("downloadUrl", downloadUrl));
        } catch (Exception e) {
            log.error("Failed to generate photo download URL for user '{}'", callerSub, e);
            return responseFactory.serverError("Failed to generate download URL");
        }
    }

    private static String routeKey(String method, String path) {
        String safeMethod = method == null ? "" : method.toUpperCase();
        String safePath = path == null ? "" : path;
        return safeMethod + " " + safePath;
    }
}

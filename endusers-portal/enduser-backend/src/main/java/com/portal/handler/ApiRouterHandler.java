package com.portal.handler;

import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.portal.util.ApiGatewayRequestParser;
import com.portal.util.ApiResponseFactory;
import org.springframework.stereotype.Component;

@Component
public class ApiRouterHandler {

    private final UserCrudApiHandler userHandler;
    private final CandidateCrudApiHandler candidateHandler;
    private final CompanyCrudApiHandler companyHandler;
    private final JobCrudApiHandler jobHandler;
    private final JobApplicationCrudApiHandler applicationHandler;
    private final ApiGatewayRequestParser requestParser;
    private final ApiResponseFactory responseFactory;

    public ApiRouterHandler(
            UserCrudApiHandler userHandler,
            CandidateCrudApiHandler candidateHandler,
            CompanyCrudApiHandler companyHandler,
            JobCrudApiHandler jobHandler,
            JobApplicationCrudApiHandler applicationHandler,
            ApiGatewayRequestParser requestParser,
            ApiResponseFactory responseFactory) {
        this.userHandler = userHandler;
        this.candidateHandler = candidateHandler;
        this.companyHandler = companyHandler;
        this.jobHandler = jobHandler;
        this.applicationHandler = applicationHandler;
        this.requestParser = requestParser;
        this.responseFactory = responseFactory;
    }

    public APIGatewayV2HTTPResponse handle(APIGatewayV2HTTPEvent event) {
        String path = requestParser.readPath(event);
        String method = requestParser.readMethod(event);

        try {
            if (userHandler.canHandle(method, path)) {
                return userHandler.handle(event);
            }
            if (candidateHandler.canHandle(method, path)) {
                return candidateHandler.handle(event);
            }
            if (companyHandler.canHandle(method, path)) {
                return companyHandler.handle(event);
            }
            if (jobHandler.canHandle(method, path)) {
                return jobHandler.handle(event);
            }
            if (applicationHandler.canHandle(method, path)) {
                return applicationHandler.handle(event);
            }
            return responseFactory.notFound("Route not found: " + method + " " + path);
        } catch (Exception e) {
            return responseFactory.serverError("Internal server error: " + e.getMessage());
        }
    }
}

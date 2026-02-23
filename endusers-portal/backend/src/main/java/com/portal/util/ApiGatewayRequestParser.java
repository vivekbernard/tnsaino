package com.portal.util;

import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

@Component
public class ApiGatewayRequestParser {

    public String readPath(APIGatewayV2HTTPEvent event) {
        String rawPath = event.getRawPath();
        return (rawPath != null && !rawPath.isBlank()) ? rawPath : "";
    }

    public String readMethod(APIGatewayV2HTTPEvent event) {
        APIGatewayV2HTTPEvent.RequestContext context = event.getRequestContext();
        if (context != null && context.getHttp() != null) {
            String method = context.getHttp().getMethod();
            if (method != null && !method.isBlank()) {
                return method;
            }
        }
        return "";
    }

    public String readQueryParam(APIGatewayV2HTTPEvent event, String key) {
        Map<String, String> params = event.getQueryStringParameters();
        return (params == null) ? null : params.get(key);
    }

    public int readIntQueryParam(APIGatewayV2HTTPEvent event, String key, int defaultValue) {
        String value = readQueryParam(event, key);
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    public String readBody(APIGatewayV2HTTPEvent event) {
        String body = event.getBody();
        if (body == null) return null;

        if (Boolean.TRUE.equals(event.getIsBase64Encoded())) {
            byte[] decoded = Base64.getDecoder().decode(body);
            return new String(decoded, StandardCharsets.UTF_8);
        }

        return body;
    }

    public String readUserRole(APIGatewayV2HTTPEvent event) {
        Map<String, String> jwt = extractJwtClaims(event);
        if (jwt == null) return null;
        return jwt.get("custom:role");
    }

    public String readUserId(APIGatewayV2HTTPEvent event) {
        Map<String, String> jwt = extractJwtClaims(event);
        if (jwt == null) return null;
        return jwt.get("sub");
    }

    private Map<String, String> extractJwtClaims(APIGatewayV2HTTPEvent event) {
        APIGatewayV2HTTPEvent.RequestContext ctx = event.getRequestContext();
        if (ctx == null || ctx.getAuthorizer() == null) return null;
        APIGatewayV2HTTPEvent.RequestContext.Authorizer auth = ctx.getAuthorizer();
        if (auth.getJwt() == null) return null;
        return auth.getJwt().getClaims();
    }
}

package com.portal.util;

import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;

@Component
public class ApiResponseFactory {

    private static final Logger log = LoggerFactory.getLogger(ApiResponseFactory.class);
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    private static final Map<String, String> JSON_HEADERS = Map.of("content-type", "application/json");

    public APIGatewayV2HTTPResponse ok(Object payload) {
        return response(200, toJson(payload));
    }

    public APIGatewayV2HTTPResponse created(Object payload) {
        return response(201, toJson(payload));
    }

    public APIGatewayV2HTTPResponse badRequest(String message) {
        return response(400, toJson(Collections.singletonMap("message", message)));
    }

    public APIGatewayV2HTTPResponse unauthorized(String message) {
        return response(401, toJson(Collections.singletonMap("message", message)));
    }

    public APIGatewayV2HTTPResponse forbidden(String message) {
        return response(403, toJson(Collections.singletonMap("message", message)));
    }

    public APIGatewayV2HTTPResponse notFound(String message) {
        return response(404, toJson(Collections.singletonMap("message", message)));
    }

    public APIGatewayV2HTTPResponse conflict(String message) {
        return response(409, toJson(Collections.singletonMap("message", message)));
    }

    public APIGatewayV2HTTPResponse serverError(String message) {
        return response(500, toJson(Collections.singletonMap("message", message)));
    }

    private APIGatewayV2HTTPResponse response(int statusCode, String body) {
        return APIGatewayV2HTTPResponse.builder()
                .withStatusCode(statusCode)
                .withHeaders(JSON_HEADERS)
                .withBody(body)
                .build();
    }

    private String toJson(Object value) {
        try {
            return OBJECT_MAPPER.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize response payload", e);
            return "{\"message\":\"Serialization error\"}";
        }
    }

    public static ObjectMapper objectMapper() {
        return OBJECT_MAPPER;
    }
}

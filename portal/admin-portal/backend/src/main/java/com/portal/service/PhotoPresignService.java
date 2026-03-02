package com.portal.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;

@Service
public class PhotoPresignService {

    private static final Logger log = LoggerFactory.getLogger(PhotoPresignService.class);
    private static final Duration URL_EXPIRY = Duration.ofMinutes(15);
    private final String bucket;
    private final Region region;
    private final S3Presigner presigner;

    public PhotoPresignService() {
        this.bucket = System.getenv("S3_PHOTO_BUCKET");
        String regionStr = System.getenv("AWS_REGION");
        this.region = Region.of(regionStr != null ? regionStr : "us-east-1");
        this.presigner = S3Presigner.builder()
                .region(region)
                .build();
    }

    private String photoKey(String userId) {
        return "candidates/" + userId + "/photo";
    }

    private String logoKey(String userId) {
        return "companies/" + userId + "/logo";
    }

    public String generateDownloadUrl(String userId) {
        GetObjectRequest objectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(photoKey(userId))
                .build();
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(URL_EXPIRY)
                .getObjectRequest(objectRequest)
                .build();
        return presigner.presignGetObject(presignRequest).url().toString();
    }

    public boolean photoExists(String userId) {
        return objectExists(photoKey(userId));
    }

    public String generateLogoDownloadUrl(String userId) {
        GetObjectRequest objectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(logoKey(userId))
                .build();
        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(URL_EXPIRY)
                .getObjectRequest(objectRequest)
                .build();
        return presigner.presignGetObject(presignRequest).url().toString();
    }

    public String generateLogoUploadUrl(String userId, String contentType) {
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(logoKey(userId))
                .contentType(contentType)
                .build();
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(URL_EXPIRY)
                .putObjectRequest(objectRequest)
                .build();
        return presigner.presignPutObject(presignRequest).url().toString();
    }

    public boolean logoExists(String userId) {
        return objectExists(logoKey(userId));
    }

    private boolean objectExists(String key) {
        try {
            software.amazon.awssdk.services.s3.S3Client.builder()
                    .region(region)
                    .build()
                    .headObject(HeadObjectRequest.builder()
                            .bucket(bucket)
                            .key(key)
                            .build());
            return true;
        } catch (NoSuchKeyException ignored) {
            return false;
        } catch (Exception e) {
            log.error("S3 headObject failed for key '{}': {}", key, e.getMessage(), e);
            throw e;
        }
    }
}

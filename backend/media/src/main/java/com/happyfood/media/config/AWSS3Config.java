package com.happyfood.media.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class AWSS3Config {
    @Value("${aws.accessKey}")
    private String accessKey;
    @Value("${aws.secretKey}")
    private String secretKey;
    @Value("${aws.region}")
    private String region;
    @Bean
    public AmazonS3 getS3Client() {
        final AWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonS3ClientBuilder.standard().withCredentials(new AWSStaticCredentialsProvider(credentials)).withRegion(region).build();
    }
}
package com.happyfood.gatewayserver.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.cloud.netflix.hystrix.EnableHystrix;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableHystrix
public class GatewayConfig {
    @Autowired
    private AuthenticationFilter filter;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("AUTH", r -> r.path("/auth/**")
                        .filters(f -> f.filter(filter))
                        .uri("http://auth:7080"))
                .route("ACCOUNTS", r -> r.path("/accounts/**", "/accounts-details/**")
                        .filters(f -> f.filter(filter))
                        .uri("http://accounts:8080"))
                .route("POSTS", r -> r.path("/posts/**", "/posts-details/**")
                        .filters(f -> f.filter(filter))
                        .uri("http://posts:8090"))
                .route("MEDIA", r -> r.path("/media/**")
                        .filters(f -> f.filter(filter))
                        .uri("http://media:9000"))
                .route("ORGANIZATIONPOSTS", r -> r.path("/organizationposts/**")
                        .filters(f -> f.filter(filter))
                        .uri("http://organizationposts:9010"))
                .route("CHATS", r -> r.path("/chats/**", "/ws-chats/**")
                        .filters(f -> f.filter(filter))
                        .uri("http://chats:9020"))
                .route("NOTIFICATIONS", r -> r.path("/notifications/**", "/ws-notifications/**")
                        .filters(f -> f.filter(filter))
                        .uri("http://notifications:9030"))
                .route("REPORTS", r -> r.path("/reports/**")
                        .filters(f -> f.filter(filter))
                        .uri("http://reports:9040"))
                .build();
    }
}
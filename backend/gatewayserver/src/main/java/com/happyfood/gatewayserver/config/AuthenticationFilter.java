package com.happyfood.gatewayserver.config;

import com.happyfood.gatewayserver.service.JwtUtils;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@RefreshScope
@Component
public class AuthenticationFilter implements GatewayFilter {

    @Autowired
    private RouterValidator validator;
    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        if (validator.isSecured.test(request)) {
            try {
                exchange.getRequest().mutate().headers(httpHeaders -> {
                    httpHeaders.remove("userId");
                    httpHeaders.remove("role");
                });

                if (authMissing(request)) {
                    return onError(exchange, HttpStatus.UNAUTHORIZED);
                }

                final String token = request.getHeaders().getOrEmpty("Authorization").get(0);

                if (jwtUtils.isExpired(token)) {
                    return onError(exchange, HttpStatus.UNAUTHORIZED);
                }
                populateRequestWithHeaders(exchange, token);
            } catch (Exception e) {
                return onError(exchange, HttpStatus.FORBIDDEN);
            }
        }
        return chain.filter(exchange);
    }

    private Mono<Void> onError(ServerWebExchange exchange, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }

    private boolean authMissing(ServerHttpRequest request) {
        return !request.getHeaders().containsKey("Authorization");
    }
    private void populateRequestWithHeaders(ServerWebExchange exchange, String token) {
        Claims claims = jwtUtils.getClaims(token);
        exchange.getRequest().mutate()
                .header("userId", String.valueOf(claims.get("userId")))
                .header("role", String.valueOf(claims.get("role")))
                .build();
    }
}
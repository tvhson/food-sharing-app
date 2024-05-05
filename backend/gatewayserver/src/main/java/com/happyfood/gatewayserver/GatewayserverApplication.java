package com.happyfood.gatewayserver;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.circuitbreaker.resilience4j.ReactiveResilience4JCircuitBreakerFactory;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JConfigBuilder;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import reactor.core.publisher.Mono;

import java.beans.Customizer;
import java.time.Duration;
import java.time.LocalDateTime;

@SpringBootApplication
@EnableDiscoveryClient
public class GatewayserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(GatewayserverApplication.class, args);
	}

//	@Bean
//	public RouteLocator happyFoodRoutesConfig(RouteLocatorBuilder routeLocatorBuilder) {
//		return routeLocatorBuilder.routes()
//				.route(p -> p
//						.path("/happyfood/accounts/**")
//						.filters(f -> f.rewritePath("/happyfood/accounts/(?<segment>.*)", "/${segment}")
//								.addRequestHeader("X-Response-Time", LocalDateTime.now().toString())
//								.circuitBreaker(config -> config.setName("accountsCircuitBreaker")
//										.setFallbackUri("forward:/contactSupport"))
////								limiting the rate of requests to 1 per second
////								.requestRateLimiter(config -> config.setRateLimiter(redisRateLimiter())
////										.setKeyResolver(userKeyResolver()))
//										)
//						.uri("lb://ACCOUNTS"))
//				.route(p -> p
//						.path("/happyfood/sharingposts/**")
//						.filters(f -> f.rewritePath("/happyfood/sharingposts/(?<segment>.*)", "/${segment}")
//								.addRequestHeader("X-Response-Time", LocalDateTime.now().toString())
////								.retry(config -> config.setRetries(3)
////										.setMethods(HttpMethod.GET)
////										.setBackoff(Duration.ofMillis(100), Duration.ofMillis(1000), 2, true))
//						)
//						.uri("lb://SHARINGPOSTS"))
//				.build();
//	}
//
//	@Bean
//	public RedisRateLimiter redisRateLimiter() {
//		return new RedisRateLimiter(1, 1, 1);
//	}
//
//	@Bean
//	KeyResolver userKeyResolver() {
//		return exchange -> Mono.justOrEmpty(exchange.getRequest().getHeaders().getFirst("user"))
//				.defaultIfEmpty("anonymous");
//	}
}

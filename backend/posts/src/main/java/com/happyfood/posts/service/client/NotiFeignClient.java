package com.happyfood.posts.service.client;

import com.happyfood.posts.dto.NotificationsDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "notifications", url = "http://notifications:9030", fallback = NotiFallback.class)
public interface NotiFeignClient {
    @PostMapping(value = "/notifications", consumes = "application/json")
    public ResponseEntity<NotificationsDto> createNotification(@RequestBody NotificationsDto notification);
}

package com.happyfood.posts.service.client;

import com.happyfood.posts.dto.NotificationsDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class NotiFallback implements NotiFeignClient {
    @Override
    public ResponseEntity<NotificationsDto> createNotification(NotificationsDto notification) {
        return null;
    }
}

package com.happyfood.notifications.controller;

import com.happyfood.notifications.entity.Notifications;
import com.happyfood.notifications.service.INotificationsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notifications")
public class NotificationsController {
    private final INotificationsService notificationsService;

    @GetMapping
    public ResponseEntity<List<Notifications>> getNotifications(@RequestHeader Long userId) {
        return ResponseEntity.ok(notificationsService.getNotifications(userId));
    }

    @PostMapping
    public ResponseEntity<Notifications> createNotification(@RequestBody Notifications notification) {
        return ResponseEntity.ok(notificationsService.createNotification(notification));
    }

    @PutMapping("/read/{notificationId}")
    public ResponseEntity<?> readNotification(@RequestHeader Long userId, @PathVariable Long notificationId) {
        notificationsService.readNotification(userId, notificationId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> readAllNotifications(@RequestHeader Long userId) {
        notificationsService.readAllNotifications(userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update-type/{notificationId}")
    public ResponseEntity<?> updateType(@PathVariable Long notificationId, @RequestParam String type) {
        notificationsService.updateType(notificationId, type);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId) {
        notificationsService.deleteNotification(notificationId);
        return ResponseEntity.ok().build();
    }
}

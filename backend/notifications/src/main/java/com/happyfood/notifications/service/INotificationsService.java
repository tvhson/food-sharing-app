package com.happyfood.notifications.service;

import com.happyfood.notifications.entity.Notifications;

import java.util.List;

public interface INotificationsService {
    List<Notifications> getNotifications(Long userId);
    Notifications createNotification(Notifications message);
    void readNotification(Long userId, Long notificationId);
    void readAllNotifications(Long userId);
}

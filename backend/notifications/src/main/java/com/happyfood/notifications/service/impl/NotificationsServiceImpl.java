package com.happyfood.notifications.service.impl;

import com.happyfood.notifications.entity.Notifications;
import com.happyfood.notifications.exception.CustomException;
import com.happyfood.notifications.repository.NotificationsRepository;
import com.happyfood.notifications.service.INotificationsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationsServiceImpl implements INotificationsService {
    private final NotificationsRepository notificationsRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Override
    public List<Notifications> getNotifications(Long userId) {
        List<Notifications> notifications = notificationsRepository.findByUserId(userId);
        Collections.reverse(notifications);
        return notifications;
    }

    @Override
    public Notifications createNotification(Notifications message) {
        message.setCreatedDate(new Date());
        Notifications saved = notificationsRepository.save(message);

        simpMessagingTemplate.convertAndSendToUser(
                message.getUserId().toString(), "/queue/notifications",
                saved
        );
        return saved;
    }

    @Override
    public void readNotification(Long userId, Long notificationId) {
        Notifications notification = notificationsRepository.findById(notificationId).orElseThrow(() -> new CustomException("Không tìm thấy thông báo", HttpStatus.NOT_FOUND));
        notification.setRead(true);
        notificationsRepository.save(notification);
    }

    @Override
    public void readAllNotifications(Long userId) {
        List<Notifications> notifications = notificationsRepository.findByUserIdAndIsRead(userId, false);
        notifications.forEach(notification -> {
            notification.setRead(true);
            notificationsRepository.save(notification);
        });
    }

    @Override
    public void updateNotification(Long notificationId, Notifications notificationNew) {
        Notifications notification = notificationsRepository.findById(notificationId).orElseThrow(() -> new CustomException("Không tìm thấy thông báo", HttpStatus.NOT_FOUND));
        notification.setTitle(notificationNew.getTitle());
        notification.setImageUrl(notificationNew.getImageUrl());
        notification.setDescription(notificationNew.getDescription());
        notification.setType(notificationNew.getType());
        notification.setCreatedDate(notificationNew.getCreatedDate());
        notification.setLinkId(notificationNew.getLinkId());
        notification.setUserId(notificationNew.getUserId());
        notification.setSenderId(notificationNew.getSenderId());
        notificationsRepository.save(notification);
    }

    @Override
    public void deleteNotification(Long notificationId) {
        notificationsRepository.deleteById(notificationId);
    }
}

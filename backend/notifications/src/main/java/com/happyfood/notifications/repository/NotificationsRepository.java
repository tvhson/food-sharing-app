package com.happyfood.notifications.repository;

import com.happyfood.notifications.entity.Notifications;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationsRepository extends JpaRepository<Notifications, Long> {
    List<Notifications> findByUserId(Long userId);
    List<Notifications> findByUserIdAndIsRead(Long userId, boolean isRead);
}

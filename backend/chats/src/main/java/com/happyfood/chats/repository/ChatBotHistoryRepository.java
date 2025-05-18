package com.happyfood.chats.repository;

import com.happyfood.chats.entity.ChatBotHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatBotHistoryRepository extends JpaRepository<ChatBotHistory, Long> {
    List<ChatBotHistory> findByUserId(Long userId);
}

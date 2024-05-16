package com.happyfood.chats.repository;

import com.happyfood.chats.entity.ChatMessages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatMessagesRepository extends JpaRepository<ChatMessages, Long> {
    List<ChatMessages> findByChatRoomId(Long chatRoomId);
}

package com.happyfood.chats.service;

import com.happyfood.chats.entity.ChatMessages;
import com.happyfood.chats.entity.ChatRooms;

import java.util.List;

public interface IChatsService {
    void sendMessage(Long userId, ChatMessages chatMessage);
    List<ChatMessages> getChatMessages(Long userId, Long chatId);
    List<ChatRooms> getChatRooms(Long userId);
    void updateStatuses(Long userId, Long chatId);
}

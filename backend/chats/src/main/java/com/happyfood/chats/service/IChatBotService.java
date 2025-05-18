package com.happyfood.chats.service;

import com.happyfood.chats.dto.ChatBotDto;
import com.happyfood.chats.dto.ChatBotMessage;

import java.util.List;

public interface IChatBotService {
    ChatBotDto chat(String content, Long userId);
    List<ChatBotDto> getHistory(Long userId);
}

package com.happyfood.chats.service;

import com.happyfood.chats.dto.ChatBotRequest;
import com.happyfood.chats.dto.ChatBotResponse;

public interface IChatBotService {
    ChatBotResponse chat(String content);
}

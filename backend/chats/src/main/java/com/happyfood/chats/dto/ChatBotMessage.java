package com.happyfood.chats.dto;

import com.happyfood.chats.util.ChatBotRole;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatBotMessage {
    private String role;
    private String content;

    public ChatBotMessage() {}

    public ChatBotMessage(ChatBotRole role, String content) {
        this.role = role.getValue();
        this.content = content;
    }
}


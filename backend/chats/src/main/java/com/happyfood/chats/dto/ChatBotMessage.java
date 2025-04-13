package com.happyfood.chats.dto;

import com.happyfood.chats.util.ChatBotRole;

public class ChatBotMessage {
    private String role;
    private String content;

    public ChatBotMessage() {}

    public ChatBotMessage(ChatBotRole role, String content) {
        this.role = role.getValue();
        this.content = content;
    }

    // Getters và Setters
    public String getRole() {
        return role;
    }

    public void setRole(ChatBotRole role) {
        this.role = role.getValue();
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

package com.happyfood.chats.util;

public enum ChatBotRole {
    SYSTEM("system"),
    USER("user"),
    ASSISTANT("assistant");

    private final String value;

    ChatBotRole(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}

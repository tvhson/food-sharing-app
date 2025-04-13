package com.happyfood.chats.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatBotRequest {
    private String model;
    private List<ChatBotMessage> messages;
    private int n;
    private double temperature;
}

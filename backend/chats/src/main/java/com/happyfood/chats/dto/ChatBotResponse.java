package com.happyfood.chats.dto;

import lombok.*;

import java.util.List;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatBotResponse {
    private List<Choice> choices;

    @Setter
    @Getter
    public static class Choice {
        private int index;
        private ChatBotMessage message;
    }
}

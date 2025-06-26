package com.happyfood.chats.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatImageRequest {
    private String model;
    private List<ChatImageMessage> messages;
    private int max_tokens;
}
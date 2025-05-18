package com.happyfood.chats.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatBotDto {
    private String role;
    private String content;
    private Date createdDate;
}

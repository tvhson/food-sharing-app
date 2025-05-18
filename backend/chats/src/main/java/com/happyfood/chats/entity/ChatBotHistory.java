package com.happyfood.chats.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "chat_bot_history")
public class ChatBotHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String role;
    @Column(columnDefinition = "TEXT")
    private String content;
    private Date createdDate;
}

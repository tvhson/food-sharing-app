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
@Table(name = "chat_rooms")
public class ChatRooms {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long senderId;
    private Long recipientId;
    private String senderName;
    private String recipientName;
    private String senderProfilePic;
    private String recipientProfilePic;
    private String senderStatus;
    private String recipientStatus;
    private String status;
    private String lastMessage;
    private Date lastMessageCreatedDate;
    private Long lastMessageSenderId;
}

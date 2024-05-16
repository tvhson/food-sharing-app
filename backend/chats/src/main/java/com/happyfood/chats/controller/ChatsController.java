package com.happyfood.chats.controller;

import com.happyfood.chats.entity.ChatMessages;
import com.happyfood.chats.entity.ChatRooms;
import com.happyfood.chats.service.IChatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/chats")
public class ChatsController {
    private final IChatsService chatsService;

    @MessageMapping("/message")
    public void processMessage(@Payload ChatMessages chatMessage) {
        chatsService.sendMessage(chatMessage.getSenderId(), chatMessage);
    }

    @GetMapping("/messages/{chatId}")
    public ResponseEntity<List<ChatMessages>> getChatMessages(@RequestHeader Long userId, @PathVariable Long chatId) {
        return ResponseEntity.ok(chatsService.getChatMessages(userId, chatId));
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRooms>> getChatRooms(@RequestHeader Long userId) {
        return ResponseEntity.ok(chatsService.getChatRooms(userId));
    }

    @PutMapping("/rooms/{chatId}")
    public ResponseEntity<?> updateStatuses(@RequestHeader Long userId, @PathVariable Long chatId) {
        chatsService.updateStatuses(userId, chatId);
        return ResponseEntity.ok().build();
    }
}

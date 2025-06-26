package com.happyfood.chats.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.happyfood.chats.dto.ChatBotDto;
import com.happyfood.chats.dto.MessageDto;
import com.happyfood.chats.entity.ChatMessages;
import com.happyfood.chats.entity.ChatRooms;
import com.happyfood.chats.service.IChatBotService;
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
    private final IChatBotService chatBotService;

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
    @PostMapping("/rooms/{chatId}")
    public ResponseEntity<ChatRooms> updateChatRoom(@RequestHeader Long userId, @PathVariable Long chatId, @RequestParam String status) {
        return ResponseEntity.ok(chatsService.updateChatRoom(userId, chatId, status));
    }

    @PostMapping("/chatbot")
    public ResponseEntity<ChatBotDto> chat(@RequestHeader Long userId, @RequestBody ChatBotDto chatMessage) {
        return ResponseEntity.ok(chatBotService.chat(chatMessage.getContent(), userId));
    }

    @GetMapping("/chatbot/history")
    public ResponseEntity<List<ChatBotDto>> getChatHistory(@RequestHeader Long userId) {
        return ResponseEntity.ok(chatBotService.getHistory(userId));
    }

    @PostMapping("/chatbot/image")
    public ResponseEntity<MessageDto> processImage(@RequestBody ChatBotDto chatMessage) {
        MessageDto response = chatBotService.processImage(chatMessage.getContent());
        ObjectMapper mapper = new ObjectMapper();
        try {
            String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(response);
            System.out.println("📤 JSON payload gửi lên OpenAI:\n" + json);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(response);
    }
}

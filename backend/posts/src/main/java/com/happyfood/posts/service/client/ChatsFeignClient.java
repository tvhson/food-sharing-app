package com.happyfood.posts.service.client;

import com.happyfood.posts.dto.ChatBotDto;
import com.happyfood.posts.dto.MessageDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "chats", url = "http://chats:9020", fallback = ChatsFallback.class)
public interface ChatsFeignClient {
    @PostMapping(path = "/chats/chatbot/image", consumes = "application/json")
    public ResponseEntity<MessageDto> processImage(@RequestBody ChatBotDto chatMessage);
}

package com.happyfood.posts.service.client;

import com.happyfood.posts.dto.ChatBotDto;
import com.happyfood.posts.dto.MessageDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class ChatsFallback implements ChatsFeignClient{
    @Override
    public ResponseEntity<MessageDto> processImage(ChatBotDto chatMessage) {
        return ResponseEntity.ok(MessageDto.builder().content("Hình ảnh thật thú vị").build());
    }
}

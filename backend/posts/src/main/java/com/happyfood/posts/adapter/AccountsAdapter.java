package com.happyfood.posts.adapter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.happyfood.posts.dto.AccountsDto;
import com.happyfood.posts.dto.ChatBotDto;
import com.happyfood.posts.dto.MessageDto;
import com.happyfood.posts.dto.NotificationsDto;
import com.happyfood.posts.service.client.AccountsFeignClient;
import com.happyfood.posts.service.client.ChatsFeignClient;
import com.happyfood.posts.service.client.NotiFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AccountsAdapter {
    private final AccountsFeignClient accountsFeignClient;
    private final NotiFeignClient notiFeignClient;
    private final ChatsFeignClient chatsFeignClient;

    public AccountsDto getAccount(Long accountId) {
        ResponseEntity<AccountsDto> accountDtoResponseEntity = accountsFeignClient.getAccount(accountId);
        if (accountDtoResponseEntity != null && accountDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
            AccountsDto accountsDto = accountDtoResponseEntity.getBody();
            assert accountsDto != null;
            return accountsDto;
        }
        return null;
    }

    public NotificationsDto createNotification(NotificationsDto notification) {
        ResponseEntity<NotificationsDto> notificationResponseEntity = notiFeignClient.createNotification(notification);
        if (notificationResponseEntity != null && notificationResponseEntity.getStatusCode().is2xxSuccessful()) {
            NotificationsDto notificationsDto = notificationResponseEntity.getBody();
            assert notificationsDto != null;
            return notificationsDto;
        }
        return null;
    }

    public String processImage(String imageUrl) {
        ChatBotDto chatMessage = new ChatBotDto();
        chatMessage.setContent(imageUrl);
        ResponseEntity<MessageDto> messageResponseEntity = chatsFeignClient.processImage(chatMessage);

        ObjectMapper mapper = new ObjectMapper();
        try {
            String json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(messageResponseEntity);
            System.out.println("📤 JSON Response: " + json);
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (messageResponseEntity != null && messageResponseEntity.getStatusCode().is2xxSuccessful()) {
            MessageDto messageDto = messageResponseEntity.getBody();
            assert messageDto != null;
            System.out.println(messageDto.getContent());
            return messageDto.getContent();
        }
        return null;
    }
}

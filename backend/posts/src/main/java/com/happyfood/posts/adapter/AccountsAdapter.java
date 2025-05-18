package com.happyfood.posts.adapter;

import com.happyfood.posts.dto.AccountsDto;
import com.happyfood.posts.dto.NotificationsDto;
import com.happyfood.posts.service.client.AccountsFeignClient;
import com.happyfood.posts.service.client.NotiFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AccountsAdapter {
    private final AccountsFeignClient accountsFeignClient;
    private final NotiFeignClient notiFeignClient;

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
}

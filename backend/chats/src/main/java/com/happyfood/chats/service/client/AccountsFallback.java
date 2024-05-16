package com.happyfood.chats.service.client;


import com.happyfood.chats.dto.AccountsDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class AccountsFallback implements AccountsFeignClient {
    @Override
    public ResponseEntity<AccountsDto> getAccount(Long accountId) {
        return null;
    }
}

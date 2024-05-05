package com.happyfood.auth.service.client;

import com.happyfood.auth.dto.AccountsDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class AccountsFallback implements AccountsFeignClient {
    @Override
    public ResponseEntity<AccountsDto> createAccount(AccountsDto accountsDto) {
        System.out.println("fallback");
        return null;
    }

    @Override
    public ResponseEntity<AccountsDto> login(AccountsDto accountsDto) {
        return null;
    }
}

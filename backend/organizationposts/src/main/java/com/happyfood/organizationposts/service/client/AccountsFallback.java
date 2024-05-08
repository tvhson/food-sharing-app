package com.happyfood.organizationposts.service.client;

import com.happyfood.organizationposts.dto.AccountsDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
public class AccountsFallback implements AccountsFeignClient {
    @Override
    public ResponseEntity<AccountsDto> getAccount(Long accountId) {
        return null;
    }
}

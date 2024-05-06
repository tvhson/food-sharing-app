package com.happyfood.posts.service.client;

import com.happyfood.posts.dto.AccountsDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "accounts", url = "http://accounts:8080", fallback = AccountsFallback.class)
public interface AccountsFeignClient {
    @GetMapping(value = "/accounts/info/{userId}", consumes = "application/json")
    public ResponseEntity<AccountsDto> getAccount(@PathVariable Long userId);
}

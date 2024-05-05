package com.happyfood.auth.service.client;

import com.happyfood.auth.dto.AccountsDto;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "accounts", url = "http://accounts:8080", fallback = AccountsFallback.class)
public interface AccountsFeignClient {
    @PostMapping(value = "/accounts/info", consumes = "application/json")
    public ResponseEntity<AccountsDto> createAccount(@Valid @RequestBody AccountsDto accountsDto);
    @PostMapping(value = "/accounts/login", consumes = "application/json")
    public ResponseEntity<AccountsDto> login(@RequestBody AccountsDto accountsDto);
}

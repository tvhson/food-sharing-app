package com.happyfood.accounts.controller;

import com.happyfood.accounts.dto.AccountDetailsDto;
import com.happyfood.accounts.service.IAccountsDetailsService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/accounts-details")
public class AccountsDetailsDtoController {
    private final IAccountsDetailsService accountsDetailsService;
    private static final Logger logger = LoggerFactory.getLogger(AccountsDetailsDtoController.class);
    @GetMapping(value = "/{accountId}")
    public ResponseEntity<AccountDetailsDto> getAccountDetails(
            @RequestHeader("happyfood-correlation-id") String correlationId,
            @PathVariable Long accountId) {
        logger.debug("happyFood-correlation-id found: {}", correlationId);
        return ResponseEntity.ok().body(accountsDetailsService.getAccountDetails(accountId));
    }
}

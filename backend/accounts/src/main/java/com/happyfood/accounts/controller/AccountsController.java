package com.happyfood.accounts.controller;

import com.happyfood.accounts.dto.AccountsDto;
import com.happyfood.accounts.exception.CustomException;
import com.happyfood.accounts.service.IAccountsService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import io.github.resilience4j.retry.annotation.Retry;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

@RestController
@RequiredArgsConstructor
@RequestMapping("/accounts")
@Validated
public class AccountsController {
    private final IAccountsService iAccountsService;

//    @Value("${build.version}")
    private String buildVersion;

    @RateLimiter(name = "test", fallbackMethod = "testFallback")
    @Retry(name = "test", fallbackMethod = "testFallback")
    @GetMapping
    public ResponseEntity<?> test() {
        return ResponseEntity.ok().body(buildVersion + " - test");
    }

    public ResponseEntity<?> testFallback(Throwable e) {
        return ResponseEntity.ok().body("Fallback: " + e.getMessage());
    }

    @GetMapping("/me")
    public ResponseEntity<AccountsDto> getMe(@RequestHeader Long userId) {
        return ResponseEntity.ok(iAccountsService.getAccount(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllAccounts() {
        return ResponseEntity.ok(iAccountsService.getAllAccounts());
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader Long userId,
                                            @RequestParam String oldPassword,
                                            @RequestParam String newPassword) {
        iAccountsService.changePassword(userId, oldPassword, newPassword);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AccountsDto> login(@RequestBody AccountsDto accountsDto) {
        return ResponseEntity.ok(iAccountsService.authentication(accountsDto.getEmail(), accountsDto.getPassword()));
    }

    @GetMapping("/info/{userId}")
    public ResponseEntity<AccountsDto> getAccount(@PathVariable Long userId) {
        return ResponseEntity.ok(iAccountsService.getAccount(userId));
    }

    @PostMapping("/info")
    public ResponseEntity<AccountsDto> createAccount(@Valid @RequestBody AccountsDto accountsDto) {
        return ResponseEntity.ok(iAccountsService.createAccount(accountsDto));
    }

    @PutMapping("/info")
    public ResponseEntity<AccountsDto> updateAccount(@RequestHeader Long userId, @Valid @RequestBody AccountsDto accountsDto) {
        return ResponseEntity.ok(iAccountsService.updateAccount(userId, accountsDto));
    }

    @PostMapping("/ban")
    public ResponseEntity<?> banAccount(@RequestHeader String role, @RequestParam Long userId, @RequestParam Long days) {
        if (!role.equals("ADMIN")) {
            throw new CustomException("You are not authorized to perform this action", HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(iAccountsService.banAccount(userId, days));
    }

    @PutMapping("/role/{userId}")
    public ResponseEntity<?> changeRole(@RequestHeader String role, @PathVariable Long userId, @RequestParam String newRole) {
//        if (!role.equals("ADMIN")) {
//            throw new CustomException("You are not authorized to perform this action", HttpStatus.UNAUTHORIZED);
//        }
        iAccountsService.changeRole(userId, newRole);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<AccountsDto> getAccountByEmail(@PathVariable String email) {
        return ResponseEntity.ok(iAccountsService.getAccountByEmail(email));
    }
}

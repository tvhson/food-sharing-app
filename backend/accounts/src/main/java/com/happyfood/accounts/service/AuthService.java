package com.happyfood.accounts.service;

import com.happyfood.accounts.dto.AccountsDto;
import com.happyfood.accounts.dto.AuthRequest;
import com.happyfood.accounts.dto.AuthResponse;
import com.happyfood.accounts.exception.CustomException;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtUtil jwtUtil;
    private final IAccountsService accountingService;
    public AuthResponse register(AuthRequest request, HttpServletResponse response) {

        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new CustomException("Email cannot be empty", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (!request.getEmail().contains("@")) {
            throw new CustomException("Email is invalid", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            throw new CustomException("Password cannot be empty", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (request.getPassword().length() < 6) {
            throw new CustomException("Password must be at least 6 characters", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (request.getName() == null || request.getName().isEmpty()) {
            throw new CustomException("Name cannot be empty", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        AccountsDto registeredUser = new AccountsDto();
        registeredUser.setName(request.getName());
        registeredUser.setEmail(request.getEmail());
        registeredUser.setPassword(request.getPassword());
        registeredUser.setRole("USER");

        try {
            registeredUser = accountingService.createAccount(registeredUser);
            String accessToken = jwtUtil.generate(registeredUser.getId(), registeredUser.getRole(), "ACCESS");
            String refreshToken = jwtUtil.generate(registeredUser.getId(), registeredUser.getRole(), "REFRESH");
            return new AuthResponse(accessToken, refreshToken);
        } catch (Exception e) {
            throw new CustomException("Email is already taken", HttpStatus.UNPROCESSABLE_ENTITY);
        }
    }
    public AuthResponse login(AuthRequest request, HttpServletResponse response) {
        AccountsDto accountsDto = null;
        try {
            accountsDto = accountingService.authentication(request.getEmail(), request.getPassword());
        } catch (Exception e) {
            throw new CustomException("Email/Password is wrong", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (accountsDto == null) {
            throw new CustomException("Email/Password is wrong", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (accountsDto.getStatus().equals("BANNED")) {
            throw new CustomException("Your account has been banned until " + accountsDto.getBannedDate().toString(), HttpStatus.UNAUTHORIZED);
        }

        String accessToken = jwtUtil.generate(accountsDto.getId(), accountsDto.getRole(), "ACCESS");
        String refreshToken = jwtUtil.generate(accountsDto.getId(), accountsDto.getRole(), "REFRESH");

        return new AuthResponse(accessToken, refreshToken);
    }
}

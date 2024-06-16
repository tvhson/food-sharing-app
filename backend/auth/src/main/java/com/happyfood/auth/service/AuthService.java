package com.happyfood.auth.service;

import com.happyfood.auth.dto.AccountsDto;
import com.happyfood.auth.dto.AuthRequest;
import com.happyfood.auth.dto.AuthResponse;
import com.happyfood.auth.exception.CustomException;
import com.happyfood.auth.service.client.AccountsFeignClient;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtUtil jwtUtil;
    private final AccountsFeignClient accountsFeignClient;
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
            ResponseEntity<AccountsDto> accountsDtoResponseEntity = accountsFeignClient.createAccount(registeredUser);

            if (accountsDtoResponseEntity != null && accountsDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
                registeredUser = accountsDtoResponseEntity.getBody();
                assert registeredUser != null;
                String accessToken = jwtUtil.generate(registeredUser.getId(), registeredUser.getRole(), "ACCESS");
                String refreshToken = jwtUtil.generate(registeredUser.getId(), registeredUser.getRole(), "REFRESH");
                return new AuthResponse(accessToken, refreshToken);
            }
        } catch (Exception e) {
            throw new CustomException("Email is already taken", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        return null;
    }
    public AuthResponse login(AuthRequest request, HttpServletResponse response) {
        AccountsDto user = new AccountsDto();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        AccountsDto accountsDto = null;
        try {
            accountsDto = accountsFeignClient.login(user).getBody();
        } catch (Exception e) {
            throw new CustomException("Email/Password is wrong", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (accountsDto == null) {
            throw new CustomException("Email/Password is wrong", HttpStatus.UNPROCESSABLE_ENTITY);
        }

        if (accountsDto.getStatus().equals("BANNED")) {
            throw new CustomException("Your account has been banned" + accountsDto.getBannedDate().toString(), HttpStatus.UNAUTHORIZED);
        }

        String accessToken = jwtUtil.generate(accountsDto.getId(), accountsDto.getRole(), "ACCESS");
        String refreshToken = jwtUtil.generate(accountsDto.getId(), accountsDto.getRole(), "REFRESH");

        return new AuthResponse(accessToken, refreshToken);
    }
}

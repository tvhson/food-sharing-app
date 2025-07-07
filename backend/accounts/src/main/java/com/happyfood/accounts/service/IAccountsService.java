package com.happyfood.accounts.service;

import com.happyfood.accounts.dto.AccountsDto;

import java.util.List;

public interface IAccountsService {
    AccountsDto createAccount(AccountsDto accountsDto);
    List<AccountsDto> getAllAccounts();
    AccountsDto getAccount(Long accountId);
    AccountsDto authentication(String email, String password);
    AccountsDto updateAccount(Long accountId, AccountsDto accountsDto);
    AccountsDto banAccount(Long accountId, Long days);
    void changePassword(Long accountId,String oldPassword, String newPassword);
    void changeRole(Long accountId, String role);
    AccountsDto getAccountByEmail(String email);

    void forgotPassword(String email);
    void verifyOtp(String email, String otp);
    void resetPassword(String email, String newPassword);
}

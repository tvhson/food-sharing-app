package com.happyfood.accounts.service;

import com.happyfood.accounts.dto.AccountsDto;

public interface IAccountsService {
    AccountsDto createAccount(AccountsDto accountsDto);
    AccountsDto getAccount(Long accountId);
    AccountsDto authentication(String email, String password);
    AccountsDto updateAccount(Long accountId, AccountsDto accountsDto);
    void changePassword(Long accountId,String oldPassword, String newPassword);
}

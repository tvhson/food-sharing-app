package com.happyfood.accounts.service;

import com.happyfood.accounts.controller.AccountsDetailsDtoController;
import com.happyfood.accounts.dto.AccountDetailsDto;

public interface IAccountsDetailsService {
    AccountDetailsDto getAccountDetails(Long accountId);
}

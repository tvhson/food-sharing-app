package com.happyfood.accounts.service.impl;

import com.happyfood.accounts.dto.AccountDetailsDto;
import com.happyfood.accounts.dto.AccountsDto;
import com.happyfood.accounts.dto.SharingPostsDto;
import com.happyfood.accounts.entity.Accounts;
import com.happyfood.accounts.exception.CustomException;
import com.happyfood.accounts.mapper.AccountsMapper;
import com.happyfood.accounts.repository.AccountsRepository;
import com.happyfood.accounts.service.IAccountsDetailsService;
import com.happyfood.accounts.service.client.SharingPostsFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountsDetailsServiceImpl implements IAccountsDetailsService {
    private final AccountsRepository accountsRepository;
    private final SharingPostsFeignClient sharingPostsFeignClient;
    @Override
    public AccountDetailsDto getAccountDetails(Long accountId) {

        AccountDetailsDto accountsDetailsDto = new AccountDetailsDto();

        Accounts accounts = accountsRepository.findById(accountId).orElseThrow(() -> new CustomException("Account not found", HttpStatus.NOT_FOUND));
        AccountsDto accountsDto = AccountsMapper.mapToAccountsDto(accounts);
        accountsDetailsDto.setAccountsDto(accountsDto);
        ResponseEntity<SharingPostsDto> sharingPostsDtoResponseEntity = sharingPostsFeignClient.get(accountId);
        if (sharingPostsDtoResponseEntity != null && sharingPostsDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
            accountsDetailsDto.setSharingPostsDto(sharingPostsDtoResponseEntity.getBody());
        }

        return accountsDetailsDto;
    }
}

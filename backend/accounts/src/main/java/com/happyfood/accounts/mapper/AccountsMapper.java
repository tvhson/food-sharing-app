package com.happyfood.accounts.mapper;

import com.happyfood.accounts.dto.AccountsDto;
import com.happyfood.accounts.entity.Accounts;

public class AccountsMapper {
    public static Accounts mapToAccounts(AccountsDto accountsDto) {
        return Accounts.builder()
                .id(accountsDto.getId())
                .email(accountsDto.getEmail())
                .password(accountsDto.getPassword())
                .name(accountsDto.getName())
                .role(accountsDto.getRole())
                .birthDate(accountsDto.getBirthDate())
                .imageUrl(accountsDto.getImageUrl())
                .phone(accountsDto.getPhone())
                .description(accountsDto.getDescription())
                .status(accountsDto.getStatus())
                .bannedDate(accountsDto.getBannedDate())
                .locationName(accountsDto.getLocationName())
                .latitude(accountsDto.getLatitude())
                .longitude(accountsDto.getLongitude())
                .isVegan(accountsDto.getIsVegan())
                .isChosenTag(accountsDto.getIsChosenTag())
                .build();
    }

    public static AccountsDto mapToAccountsDto(Accounts accounts) {
        return AccountsDto.builder()
                .id(accounts.getId())
                .email(accounts.getEmail())
                .password(accounts.getPassword())
                .name(accounts.getName())
                .role(accounts.getRole())
                .birthDate(accounts.getBirthDate())
                .imageUrl(accounts.getImageUrl())
                .phone(accounts.getPhone())
                .description(accounts.getDescription())
                .status(accounts.getStatus())
                .bannedDate(accounts.getBannedDate())
                .locationName(accounts.getLocationName())
                .latitude(accounts.getLatitude())
                .longitude(accounts.getLongitude())
                .isVegan(accounts.getIsVegan())
                .isChosenTag(accounts.getIsChosenTag())
                .build();
    }
}

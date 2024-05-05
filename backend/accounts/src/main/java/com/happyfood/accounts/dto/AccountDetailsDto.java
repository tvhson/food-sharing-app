package com.happyfood.accounts.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AccountDetailsDto {
    private AccountsDto accountsDto;
    private SharingPostsDto sharingPostsDto;
}

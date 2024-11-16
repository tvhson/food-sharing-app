package com.happyfood.posts.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrganizationpostsDetail {
    private AccountsDto accounts;
    private OrganizationpostsDto organizationposts;
}

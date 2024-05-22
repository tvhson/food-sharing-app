package com.happyfood.organizationposts.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountsDto {
    private Long id;
    private String name;
    private String imageUrl;
    private String locationName;
    private String latitude;
    private String longitude;
}

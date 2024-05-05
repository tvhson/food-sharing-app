package com.happyfood.accounts.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SharingPostsDto {
    private Long id;
    private String title;
    private String content;
    private String author;
    private String category;
    private String tags;
    private String status;
    private String visibility;
    private String location;
    private String expiryDate;
}

package com.happyfood.posts.dto;


import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatementsDto {
    private Long id;
    private String description;
    private Long groupId;
    private AccountsDto user;
    private Date createdDate;
}

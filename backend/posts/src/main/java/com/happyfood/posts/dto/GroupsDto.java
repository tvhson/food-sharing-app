package com.happyfood.posts.dto;

import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroupsDto {
    private Long id;
    private String name;
    private String description;
    private List<AccountsDto> members;
    private List<AccountsDto> requests;
    private String joinType;
    private String imageUrl;
    private boolean isJoined;
    private AccountsDto author;
    private Date createdDate;
    private Date startDate;
    private Date endDate;
}

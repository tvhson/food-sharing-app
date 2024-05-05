package com.happyfood.posts.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostsDetailDto {
    private AccountsDto account;
    private PostsDto post;
}

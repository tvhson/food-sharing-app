package com.happyfood.posts.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CommentsDto {
    private Long id;
    private Long userId;
    private Long postId;
    private Long organizationPostId;
    private String content;
    private String userName;
    private String avatar;
    private Date createdDate;
    private Boolean isLove;
    private int loveCount;
    private String imageUrl;
}

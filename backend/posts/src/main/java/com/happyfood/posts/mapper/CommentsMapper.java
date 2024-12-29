package com.happyfood.posts.mapper;

import com.happyfood.posts.dto.CommentsDto;
import com.happyfood.posts.entity.Comments;

public class CommentsMapper {
    public static CommentsDto mapToCommentsDto(Comments comments) {
        return CommentsDto.builder()
                .id(comments.getId())
                .userId(comments.getUserId())
                .postId(comments.getPost() != null ? comments.getPost().getId() : null)
                .organizationPostId(comments.getOrganizationPost() != null ? comments.getOrganizationPost().getId() : null)
                .content(comments.getContent())
                .userName(comments.getUserName())
                .avatar(comments.getAvatar())
                .createdDate(comments.getCreatedDate())
                .isLove(false)
                .loveCount((comments.getUserIdLikes() != null && !comments.getUserIdLikes().isEmpty()) ? comments.getUserIdLikes().split("-").length : 0)
                .build();
    }

    public static Comments mapToComments(CommentsDto commentsDto) {
        return Comments.builder()
                .id(commentsDto.getId())
                .userId(commentsDto.getUserId())
                .content(commentsDto.getContent())
                .userName(commentsDto.getUserName())
                .avatar(commentsDto.getAvatar())
                .createdDate(commentsDto.getCreatedDate())
                .build();
    }
}

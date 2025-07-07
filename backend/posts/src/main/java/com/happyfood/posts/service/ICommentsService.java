package com.happyfood.posts.service;

import com.happyfood.posts.dto.CommentsDto;

import java.util.List;

public interface ICommentsService {
    CommentsDto createComment(Long userId, Long postId, CommentsDto commentsDto);
    CommentsDto createCommentForOrganizationPost(Long userId, Long organizationPostId, CommentsDto commentsDto);
    CommentsDto updateComment(Long userId, CommentsDto commentsDto);
    void deleteComment(Long userId, String role, Long postId, Long commentId);
    List<CommentsDto> getCommentsByPostId(Long userId, Long postId);
    List<CommentsDto> getCommentsByOrganizationPostId(Long userId, Long organizationPostId);
    void toggleLikeComment(Long userId, Long commentId);
}

package com.happyfood.posts.service;

import com.happyfood.posts.dto.CommentsDto;

import java.util.List;

public interface ICommentsService {
    CommentsDto createComment(Long userId, Long postId, CommentsDto commentsDto);
    CommentsDto updateComment(Long userId, Long postId, CommentsDto commentsDto);
    void deleteComment(Long userId, Long postId, Long commentId);
    List<CommentsDto> getCommentsByPostId(Long userId, Long postId);
    void toggleLikeComment(Long userId, Long commentId);
}

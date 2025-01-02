package com.happyfood.posts.service.impl;

import com.happyfood.posts.adapter.AccountsAdapter;
import com.happyfood.posts.dto.AccountsDto;
import com.happyfood.posts.dto.CommentsDto;
import com.happyfood.posts.entity.Comments;
import com.happyfood.posts.entity.Organizationposts;
import com.happyfood.posts.entity.Posts;
import com.happyfood.posts.exception.CustomException;
import com.happyfood.posts.mapper.CommentsMapper;
import com.happyfood.posts.repository.CommentsRepository;
import com.happyfood.posts.repository.OrganizationpostsRepository;
import com.happyfood.posts.repository.PostsRepository;
import com.happyfood.posts.service.ICommentsService;
import com.happyfood.posts.service.client.AccountsFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentsServiceImpl implements ICommentsService {
    private final CommentsRepository commentsRepository;
    private final PostsRepository postsRepository;
    private final AccountsAdapter accountsAdapter;
    private final OrganizationpostsRepository organizationpostsRepository;

    @Override
    public CommentsDto createComment(Long userId, Long postId, CommentsDto commentsDto) {
        Comments comment = CommentsMapper.mapToComments(commentsDto);
        comment.setCreatedDate(new Date());

        AccountsDto accountsDto = accountsAdapter.getAccount(userId);
        comment.setUserId(userId);
        comment.setUserName(accountsDto.getName());
        comment.setAvatar(accountsDto.getImageUrl());

        Posts posts = postsRepository.findById(postId).orElseThrow(() -> new CustomException("Post not found", HttpStatus.NOT_FOUND));
        comment.setPost(posts);
        posts.getComments().add(comment);

        postsRepository.save(posts);

        return convertToResponse(comment, userId);
    }

    @Override
    public CommentsDto createCommentForOrganizationPost(Long userId, Long organizationPostId, CommentsDto commentsDto) {
        Comments comment = CommentsMapper.mapToComments(commentsDto);
        comment.setCreatedDate(new Date());

        AccountsDto accountsDto = accountsAdapter.getAccount(userId);
        comment.setUserId(userId);
        comment.setUserName(accountsDto.getName());
        comment.setAvatar(accountsDto.getImageUrl());

        Organizationposts organizationposts = organizationpostsRepository.findById(organizationPostId).orElseThrow(() -> new CustomException("Organization post not found", HttpStatus.NOT_FOUND));
        comment.setOrganizationPost(organizationposts);
        organizationposts.getComments().add(comment);

        organizationpostsRepository.save(organizationposts);
        return convertToResponse(comment, userId);
    }

    @Override
    public CommentsDto updateComment(Long userId, CommentsDto commentsDto) {
        Comments comments = commentsRepository.findById(commentsDto.getId()).orElseThrow(() -> new CustomException("Comment not found", HttpStatus.NOT_FOUND));
        if (!comments.getUserId().equals(userId)) {
            throw new CustomException("You are not allowed to update this comment", HttpStatus.FORBIDDEN);
        }
        comments.setContent(commentsDto.getContent());

        return convertToResponse(commentsRepository.save(comments), userId);
    }

    @Override
    public void deleteComment(Long userId, Long postId, Long commentId) {
        Comments comments = commentsRepository.findById(commentId).orElseThrow(() -> new CustomException("Comment not found", HttpStatus.NOT_FOUND));
        if (!comments.getUserId().equals(userId) && !comments.getPost().getCreatedById().equals(userId)) {
            throw new CustomException("You are not allowed to delete this comment", HttpStatus.FORBIDDEN);
        }
        commentsRepository.delete(comments);
    }

    @Override
    public List<CommentsDto> getCommentsByPostId(Long userId, Long postId) {
        Posts posts = postsRepository.findById(postId).orElseThrow(() -> new CustomException("Post not found", HttpStatus.NOT_FOUND));
        if (posts.getComments() == null || posts.getComments().isEmpty()) {
            return List.of();
        }
        List<Comments> comments = posts.getComments();

        return comments.stream().map(comment -> convertToResponse(comment, userId)).toList();
    }

    @Override
    public List<CommentsDto> getCommentsByOrganizationPostId(Long userId, Long organizationPostId) {
        Organizationposts organizationposts = organizationpostsRepository.findById(organizationPostId).orElseThrow(() -> new CustomException("Organization post not found", HttpStatus.NOT_FOUND));
        if (organizationposts.getComments() == null || organizationposts.getComments().isEmpty()) {
            return List.of();
        }
        List<Comments> comments = organizationposts.getComments();
        return comments.stream().map(comment -> convertToResponse(comment, userId)).toList();
    }

    @Override
    public void toggleLikeComment(Long userId, Long commentId) {
        Comments comments = commentsRepository.findById(commentId).orElseThrow(() -> new CustomException("Comment not found", HttpStatus.NOT_FOUND));
        if (comments.getUserIdLikes() == null || comments.getUserIdLikes().isEmpty()) {
            comments.setUserIdLikes(userId.toString());
        } else {
            String[] userIdLikes = comments.getUserIdLikes().split("-");
            if (Arrays.stream(userIdLikes).anyMatch(s -> s.equals(userId.toString()))) {
                comments.setUserIdLikes(Arrays.stream(userIdLikes).filter(s -> !s.equals(userId.toString())).collect(Collectors.joining("-")));
            } else {
                comments.setUserIdLikes(comments.getUserIdLikes() + "-" + userId);
            }
        }
        commentsRepository.save(comments);
    }

    private CommentsDto convertToResponse(Comments comments, Long userId) {
        CommentsDto commentsDto = CommentsMapper.mapToCommentsDto(comments);
        if (comments.getUserIdLikes() != null && !comments.getUserIdLikes().isEmpty()) {
            commentsDto.setIsLove(Arrays.stream(comments.getUserIdLikes().split("-")).anyMatch(s -> s.equals(userId.toString())));
        }
        return commentsDto;
    }
}

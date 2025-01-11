package com.happyfood.posts.service;

import com.happyfood.posts.dto.Coordinates;
import com.happyfood.posts.dto.PostsDto;

import java.util.List;

public interface IPostsService {
    PostsDto createPost(Long userId,PostsDto postsDto);
    PostsDto updatePostById(Long userId, PostsDto postsDto, Long postId);
    void deletePostById(Long userId, Long postId);
    PostsDto getPostById(Long userId, Long postId);
    List<PostsDto> getRecommendedPosts(Long userId);
    List<PostsDto> getPostsOfUser(Long userId);
    void toggleLikePost(Long userId, Long postId);;
}

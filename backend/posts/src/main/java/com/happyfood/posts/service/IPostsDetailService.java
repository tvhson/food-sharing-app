package com.happyfood.posts.service;

import com.happyfood.posts.dto.PostsDetailDto;

public interface IPostsDetailService {
    PostsDetailDto getPostDetailById(Long postId);
}

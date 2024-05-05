package com.happyfood.posts.controller;

import com.happyfood.posts.dto.PostsDetailDto;
import com.happyfood.posts.service.IPostsDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts-details")
public class PostsDetailController {
    private final IPostsDetailService postsDetailService;
    @GetMapping("/{postId}")
    public ResponseEntity<PostsDetailDto> getPostDetailById(@PathVariable Long postId) {
        return ResponseEntity.ok(postsDetailService.getPostDetailById(postId));
    }
}

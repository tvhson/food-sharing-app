package com.happyfood.posts.controller;

import com.happyfood.posts.dto.Coordinates;
import com.happyfood.posts.dto.PostsDto;
import com.happyfood.posts.service.IPostsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/posts")
public class PostsController {
    private final IPostsService postsService;

    @PostMapping
    ResponseEntity<PostsDto> createPost(@RequestHeader Long userId, @RequestBody PostsDto postsDto) {
        return ResponseEntity.ok(postsService.createPost(userId, postsDto));
    }
    @PutMapping("/{postId}")
    ResponseEntity<PostsDto> updatePostById(@RequestHeader Long userId, @RequestBody PostsDto postsDto, @PathVariable Long postId) {
        return ResponseEntity.ok(postsService.updatePostById(userId, postsDto, postId));
    }
    @DeleteMapping("/{postId}")
    ResponseEntity<?> deletePostById(@RequestHeader Long userId, @PathVariable Long postId) {
        postsService.deletePostById(userId, postId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/get/{postId}")
    ResponseEntity<PostsDto> getPostById(@PathVariable Long postId) {
        return ResponseEntity.ok(postsService.getPostById(postId));
    }
    @GetMapping("/recommended")
    ResponseEntity<List<PostsDto>> getRecommendedPosts(@RequestHeader Long userId) {
        return ResponseEntity.ok(postsService.getRecommendedPosts(userId));
    }
    @GetMapping("/user")
    ResponseEntity<List<PostsDto>> getPostsOfUser(@RequestHeader Long userId) {
        return ResponseEntity.ok(postsService.getPostsOfUser(userId));
    }

}

package com.happyfood.posts.controller;

import com.happyfood.posts.dto.CommentsDto;
import com.happyfood.posts.dto.Coordinates;
import com.happyfood.posts.dto.NumberPostsReceivedDto;
import com.happyfood.posts.dto.PostsDto;
import com.happyfood.posts.service.ICommentsService;
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
    private final ICommentsService commentsService;

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
    ResponseEntity<PostsDto> getPostById(@RequestHeader Long userId, @PathVariable Long postId) {
        return ResponseEntity.ok(postsService.getPostById(userId, postId));
    }

    @GetMapping("/recommended")
    ResponseEntity<List<PostsDto>> getRecommendedPosts(@RequestHeader Long userId,
                                                       @RequestParam(required = false) String type,
                                                       @RequestParam(required = false) String latitude,
                                                       @RequestParam(required = false) String longitude,
                                                       @RequestParam(required = false) Long distance
                                                       ) {
        return ResponseEntity.ok(postsService.getRecommendedPosts(userId, type, latitude, longitude, distance));
    }

    @GetMapping("/user")
    ResponseEntity<List<PostsDto>> getMyPosts(@RequestHeader Long userId) {
        return ResponseEntity.ok(postsService.getPostsOfUser(userId));
    }

    @GetMapping("/user/{userId}")
    ResponseEntity<List<PostsDto>> getPostsOfUser(@PathVariable Long userId) {
        return ResponseEntity.ok(postsService.getPostsOfUser(userId));
    }

    @GetMapping("/number-posts-received/{userId}")
    ResponseEntity<NumberPostsReceivedDto> getNumberPostsReceived(@PathVariable Long userId) {
        return ResponseEntity.ok(postsService.getNumberPostsReceived(userId));
    }

    @PostMapping("/confirm-received")
    ResponseEntity<?> confirmReceivedPost(@RequestParam Long userId, @RequestParam Long postId) {
        postsService.confirmReceivedPost(userId, postId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/like/{postId}")
    ResponseEntity<?> toggleLikePost(@RequestHeader Long userId, @PathVariable Long postId) {
        postsService.toggleLikePost(userId, postId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{postId}/comments")
    ResponseEntity<List<CommentsDto>> getCommentsByPostId(@RequestHeader Long userId, @PathVariable Long postId) {
        return ResponseEntity.ok(commentsService.getCommentsByPostId(userId, postId));
    }

    @PostMapping("/{postId}/comments")
    ResponseEntity<CommentsDto> createComment(@RequestHeader Long userId, @PathVariable Long postId, @RequestBody CommentsDto commentsDto) {
        return ResponseEntity.ok(commentsService.createComment(userId, postId, commentsDto));
    }

    @PutMapping("/{postId}/comments")
    ResponseEntity<CommentsDto> updateComment(@RequestHeader Long userId, @RequestBody CommentsDto commentsDto) {
        return ResponseEntity.ok(commentsService.updateComment(userId, commentsDto));
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    ResponseEntity<?> deleteComment(@RequestHeader Long userId, @PathVariable Long postId, @PathVariable Long commentId) {
        commentsService.deleteComment(userId, postId, commentId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/lovecmt/{commentId}")
    ResponseEntity<?> toggleLoveComment(@RequestHeader Long userId, @PathVariable Long commentId) {
        commentsService.toggleLikeComment(userId, commentId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete-user/{userId}")
    ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        postsService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }
}

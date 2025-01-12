package com.happyfood.posts.controller;

import com.happyfood.posts.dto.CommentsDto;
import com.happyfood.posts.dto.OrganizationpostsDetail;
import com.happyfood.posts.dto.OrganizationpostsDto;
import com.happyfood.posts.service.ICommentsService;
import com.happyfood.posts.service.IOrganizationpostsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/organizationposts")
public class OrganizationpostsController {
    private final IOrganizationpostsService organizationpostsService;
    private final ICommentsService commentsService;

    @PostMapping
    ResponseEntity<OrganizationpostsDetail> createOrganizationposts(@RequestHeader Long userId, @RequestBody OrganizationpostsDto organizationpostsDto) {
        return ResponseEntity.ok(organizationpostsService.createOrganizationposts(userId, organizationpostsDto));
    }

    @PutMapping("/{organizationpostId}")
    ResponseEntity<OrganizationpostsDetail> updateOrganizationpostsById(@PathVariable Long organizationpostId, @RequestHeader Long userId, @RequestBody OrganizationpostsDto organizationpostsDto) {
        return ResponseEntity.ok(organizationpostsService.updateOrganizationposts(organizationpostId, userId, organizationpostsDto));
    }

    @DeleteMapping("/{organizationpostId}")
    ResponseEntity<?> deleteOrganizationpostsById(@PathVariable Long organizationpostId, @RequestHeader Long userId) {
        organizationpostsService.deleteOrganizationposts(organizationpostId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get/{organizationpostId}")
    ResponseEntity<OrganizationpostsDetail> getOrganizationpostsById(@PathVariable Long organizationpostId) {
        return ResponseEntity.ok(organizationpostsService.getOrganizationpostsById(organizationpostId));
    }

    @GetMapping("/get")
    ResponseEntity<List<OrganizationpostsDetail>> getMyOrganizationposts(@RequestHeader Long userId) {
        return ResponseEntity.ok(organizationpostsService.getOrganizationpostsByUserId(userId));
    }

    @GetMapping("/user/{userId}")
    ResponseEntity<List<OrganizationpostsDto>> getOrganizationpostsByUserId(@PathVariable Long userId, @RequestHeader String role) {
        if (role.equals("USER"))
            return ResponseEntity.ok(organizationpostsService.getAttendedOrganizationpostsByUserId(userId));
        else
            return ResponseEntity.ok(organizationpostsService.getOrganizationpostsByUserIdV2(userId));
    }

    @GetMapping("/recommended")
    ResponseEntity<List<OrganizationpostsDetail>> getRecommendationOrganizationposts(@RequestHeader Long userId) {
        return ResponseEntity.ok(organizationpostsService.getRecommendationOrganizationposts(userId));
    }

    @PostMapping("/attend/{organizationpostId}")
    ResponseEntity<OrganizationpostsDetail> toggleAttendOrganizationposts(@PathVariable Long organizationpostId, @RequestHeader Long userId) {
        return ResponseEntity.ok(organizationpostsService.toggleAttendOrganizationposts(organizationpostId, userId));
    }

    @PostMapping("/{organizationpostId}/comments")
    ResponseEntity<CommentsDto> createCommentForOrganizationPost(@RequestHeader Long userId, @PathVariable Long organizationpostId, @RequestBody CommentsDto commentsDto) {
        return ResponseEntity.ok(commentsService.createCommentForOrganizationPost(userId, organizationpostId, commentsDto));
    }

    @GetMapping("/{organizationpostId}/comments")
    ResponseEntity<List<CommentsDto>> getCommentsByOrganizationPostId(@RequestHeader Long userId, @PathVariable Long organizationpostId) {
        return ResponseEntity.ok(commentsService.getCommentsByOrganizationPostId(userId, organizationpostId));
    }

    @PutMapping("/{organizationpostId}/comments")
    ResponseEntity<CommentsDto> updateComment(@RequestHeader Long userId, @RequestBody CommentsDto commentsDto) {
        return ResponseEntity.ok(commentsService.updateComment(userId, commentsDto));
    }

    @DeleteMapping("/{organizationpostId}/comments/{commentId}")
    ResponseEntity<?> deleteComment(@RequestHeader Long userId, @PathVariable Long organizationpostId, @PathVariable Long commentId) {
        commentsService.deleteComment(userId, organizationpostId, commentId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/lovecmt/{commentId}")
    ResponseEntity<?> toggleLoveComment(@RequestHeader Long userId, @PathVariable Long commentId) {
        commentsService.toggleLikeComment(userId, commentId);
        return ResponseEntity.ok().build();
    }
}

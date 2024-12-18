package com.happyfood.posts.controller;

import com.happyfood.posts.dto.OrganizationpostsDetail;
import com.happyfood.posts.dto.OrganizationpostsDto;
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
    ResponseEntity<List<OrganizationpostsDetail>> getOrganizationpostsByUserId(@RequestHeader Long userId) {
        return ResponseEntity.ok(organizationpostsService.getOrganizationpostsByUserId(userId));
    }

    @GetMapping("/recommended")
    ResponseEntity<List<OrganizationpostsDetail>> getRecommendationOrganizationposts(@RequestHeader Long userId) {
        return ResponseEntity.ok(organizationpostsService.getRecommendationOrganizationposts(userId));
    }

    @PostMapping("/attend/{organizationpostId}")
    ResponseEntity<OrganizationpostsDetail> toggleAttendOrganizationposts(@PathVariable Long organizationpostId, @RequestHeader Long userId) {
        return ResponseEntity.ok(organizationpostsService.toggleAttendOrganizationposts(organizationpostId, userId));
    }
}

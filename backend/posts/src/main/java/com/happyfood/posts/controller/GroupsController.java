package com.happyfood.posts.controller;

import com.happyfood.posts.dto.GroupsDto;
import com.happyfood.posts.service.IGroupsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/groups")
public class GroupsController {
    private final IGroupsService groupsService;

    @PostMapping("/create")
    ResponseEntity<GroupsDto> createGroup(@RequestHeader Long userId, @RequestBody GroupsDto groupsDto) {
        return ResponseEntity.ok(groupsService.createGroup(userId, groupsDto));
    }

    @GetMapping("/recommended")
    ResponseEntity<List<GroupsDto>> getRecommendedGroups(@RequestHeader Long userId) {
        return ResponseEntity.ok(groupsService.getAllGroups(userId));
    }

    @PutMapping("/{groupId}")
    ResponseEntity<GroupsDto> updateGroupById(@RequestHeader Long userId, @RequestBody GroupsDto groupsDto, @PathVariable Long groupId) {
        return ResponseEntity.ok(groupsService.updateGroup(userId, groupId, groupsDto));
    }

    @DeleteMapping("/{groupId}")
    ResponseEntity<?> deleteGroupById(@RequestHeader Long userId, @PathVariable Long groupId) {
        groupsService.deleteGroup(groupId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get-my-groups")
    ResponseEntity<List<GroupsDto>> getMyGroups(@RequestHeader Long userId) {
        return ResponseEntity.ok(groupsService.getMyGroups(userId));
    }

    @PostMapping("/invite/{groupId}/{userId}")
    ResponseEntity<?> inviteUserToGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        return ResponseEntity.ok(groupsService.inviteUserToGroup(groupId, userId));
    }

    @PostMapping("/accept/{groupId}/{userId}")
    ResponseEntity<?> acceptGroupInvitation(@PathVariable Long groupId, @PathVariable Long userId) {
        return ResponseEntity.ok(groupsService.acceptGroupInvitation(groupId, userId));
    }

    @PostMapping("/reject/{groupId}/{userId}")
    ResponseEntity<?> rejectGroupInvitation(@PathVariable Long groupId, @PathVariable Long userId) {
        return ResponseEntity.ok(groupsService.rejectGroupInvitation(groupId, userId));
    }

    @PostMapping("/remove/{groupId}/{userId}")
    ResponseEntity<?> removeUserFromGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        return ResponseEntity.ok(groupsService.removeUserFromGroup(groupId, userId));
    }

    @PostMapping("/join/{groupId}/{userId}")
    ResponseEntity<?> joinGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        return ResponseEntity.ok(groupsService.joinGroup(groupId, userId));
    }

    @PostMapping("/leave/{groupId}/{userId}")
    ResponseEntity<?> leaveGroup(@PathVariable Long groupId, @PathVariable Long userId) {
        return ResponseEntity.ok(groupsService.leaveGroup(groupId, userId));
    }
}

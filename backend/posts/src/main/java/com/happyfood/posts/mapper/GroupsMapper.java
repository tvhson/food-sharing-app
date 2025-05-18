package com.happyfood.posts.mapper;

import com.happyfood.posts.dto.GroupsDto;
import com.happyfood.posts.entity.Groups;

public class GroupsMapper {
    public static GroupsDto mapToGroupsDto(Groups groups) {
        return GroupsDto.builder()
                .id(groups.getId())
                .name(groups.getName())
                .description(groups.getDescription())
                .joinType(groups.getJoinType())
                .imageUrl(groups.getImageUrl())
                .createdDate(groups.getCreatedDate())
                .startDate(groups.getStartDate())
                .endDate(groups.getEndDate())
                .build();
    }
    public static Groups mapToGroups(GroupsDto groupsDto) {
        return Groups.builder()
                .id(groupsDto.getId())
                .name(groupsDto.getName())
                .description(groupsDto.getDescription())
                .joinType(groupsDto.getJoinType())
                .imageUrl(groupsDto.getImageUrl())
                .createdDate(groupsDto.getCreatedDate())
                .startDate(groupsDto.getStartDate())
                .endDate(groupsDto.getEndDate())
                .build();
    }
}

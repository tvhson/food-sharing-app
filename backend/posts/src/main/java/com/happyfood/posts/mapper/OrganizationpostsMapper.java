package com.happyfood.posts.mapper;


import com.happyfood.posts.dto.OrganizationpostsDto;
import com.happyfood.posts.entity.Organizationposts;

public class OrganizationpostsMapper {
    public static Organizationposts mapToOrganizationposts(OrganizationpostsDto organizationpostsDto) {
        return Organizationposts.builder()
                .title(organizationpostsDto.getTitle())
                .description(organizationpostsDto.getDescription())
                .imageUrl(organizationpostsDto.getImageUrl())
                .createdDate(organizationpostsDto.getCreatedDate())
                .startDate(organizationpostsDto.getStartDate())
                .linkWebsites(organizationpostsDto.getLinkWebsites())
                .userId(organizationpostsDto.getUserId())
                .locationName(organizationpostsDto.getLocationName())
                .longitude(organizationpostsDto.getLongitude())
                .latitude(organizationpostsDto.getLatitude())
                .groupId(organizationpostsDto.getGroupId())
                .build();
    }

    public static OrganizationpostsDto mapToOrganizationpostsDto(Organizationposts organizationposts) {
        return OrganizationpostsDto.builder()
                .id(organizationposts.getId())
                .title(organizationposts.getTitle())
                .description(organizationposts.getDescription())
                .imageUrl(organizationposts.getImageUrl())
                .createdDate(organizationposts.getCreatedDate())
                .startDate(organizationposts.getStartDate())
                .linkWebsites(organizationposts.getLinkWebsites())
                .userId(organizationposts.getUserId())
                .locationName(organizationposts.getLocationName())
                .longitude(organizationposts.getLongitude())
                .latitude(organizationposts.getLatitude())
                .groupId(organizationposts.getGroupId())
                .build();
    }
}

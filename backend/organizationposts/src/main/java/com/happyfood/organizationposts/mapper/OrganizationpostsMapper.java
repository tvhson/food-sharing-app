package com.happyfood.organizationposts.mapper;

import com.happyfood.organizationposts.dto.OrganizationpostsDto;
import com.happyfood.organizationposts.entity.Organizationposts;

public class OrganizationpostsMapper {
    public static Organizationposts mapToOrganizationposts(OrganizationpostsDto organizationpostsDto) {
        return Organizationposts.builder()
                .title(organizationpostsDto.getTitle())
                .description(organizationpostsDto.getDescription())
                .peopleAttended(organizationpostsDto.getPeopleAttended())
                .imageUrl(organizationpostsDto.getImageUrl())
                .createdDate(organizationpostsDto.getCreatedDate())
                .linkWebsites(organizationpostsDto.getLinkWebsites())
                .userId(organizationpostsDto.getUserId())
                .build();
    }

    public static OrganizationpostsDto mapToOrganizationpostsDto(Organizationposts organizationposts) {
        return OrganizationpostsDto.builder()
                .id(organizationposts.getId())
                .title(organizationposts.getTitle())
                .description(organizationposts.getDescription())
                .peopleAttended(organizationposts.getPeopleAttended())
                .imageUrl(organizationposts.getImageUrl())
                .createdDate(organizationposts.getCreatedDate())
                .linkWebsites(organizationposts.getLinkWebsites())
                .userId(organizationposts.getUserId())
                .build();
    }
}

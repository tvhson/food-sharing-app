package com.happyfood.posts.service;


import com.happyfood.posts.dto.OrganizationpostsDetail;
import com.happyfood.posts.dto.OrganizationpostsDto;

import java.util.List;

public interface IOrganizationpostsService {
    OrganizationpostsDetail getOrganizationpostsById(Long id);
    List<OrganizationpostsDetail> getRecommendationOrganizationposts(Long userId, Long groupId);
    List<OrganizationpostsDetail> getOrganizationpostsByUserId(Long userId);
    OrganizationpostsDetail createOrganizationposts(Long userId, OrganizationpostsDto organizationpostsDto);
    OrganizationpostsDetail updateOrganizationposts(Long id, Long userId, OrganizationpostsDto organizationpostsDto);
    OrganizationpostsDetail toggleAttendOrganizationposts(Long id, Long userId);
    void deleteOrganizationposts(Long id, Long userId, String role);
    List<OrganizationpostsDto> getOrganizationpostsByUserIdV2(Long userId);
    List<OrganizationpostsDto> getAttendedOrganizationpostsByUserId(Long userId);
}

package com.happyfood.organizationposts.service;

import com.happyfood.organizationposts.dto.OrganizationpostsDetail;
import com.happyfood.organizationposts.dto.OrganizationpostsDto;

import java.util.List;

public interface IOrganizationpostsService {
    OrganizationpostsDetail getOrganizationpostsById(Long id);
    List<OrganizationpostsDetail> getRecommendationOrganizationposts(Long userId);
    List<OrganizationpostsDto> getOrganizationpostsByUserId(Long userId);
    OrganizationpostsDto createOrganizationposts(Long userId, OrganizationpostsDto organizationpostsDto);
    OrganizationpostsDto updateOrganizationposts(Long id, Long userId, OrganizationpostsDto organizationpostsDto);
    void deleteOrganizationposts(Long id, Long userId);
}

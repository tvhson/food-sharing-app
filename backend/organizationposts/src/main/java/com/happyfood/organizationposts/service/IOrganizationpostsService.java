package com.happyfood.organizationposts.service;

import com.happyfood.organizationposts.dto.Coordinates;
import com.happyfood.organizationposts.dto.OrganizationpostsDetail;
import com.happyfood.organizationposts.dto.OrganizationpostsDto;

import java.util.List;

public interface IOrganizationpostsService {
    OrganizationpostsDetail getOrganizationpostsById(Long id);
    List<OrganizationpostsDetail> getRecommendationOrganizationposts(Long userId);
    List<OrganizationpostsDetail> getOrganizationpostsByUserId(Long userId);
    OrganizationpostsDetail createOrganizationposts(Long userId, OrganizationpostsDto organizationpostsDto);
    OrganizationpostsDetail updateOrganizationposts(Long id, Long userId, OrganizationpostsDto organizationpostsDto);
    OrganizationpostsDetail toggleAttendOrganizationposts(Long id, Long userId);
    void deleteOrganizationposts(Long id, Long userId);
}

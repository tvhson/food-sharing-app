package com.happyfood.posts.repository;

import com.happyfood.posts.entity.Organizationposts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrganizationpostsRepository extends JpaRepository<Organizationposts, Long> {
    List<Organizationposts> findByUserId(Long userId);
    List<Organizationposts> findByGroupId(Long groupId);
}

package com.happyfood.organizationposts.repository;

import com.happyfood.organizationposts.entity.Organizationposts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrganizationpostsRepository extends JpaRepository<Organizationposts, Long> {
    List<Organizationposts> findByUserId(Long userId);
}

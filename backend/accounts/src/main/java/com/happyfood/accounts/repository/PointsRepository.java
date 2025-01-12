package com.happyfood.accounts.repository;

import com.happyfood.accounts.entity.Points;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PointsRepository extends JpaRepository<Points, Long> {
    Optional<Points> findByAccountId(Long accountId);
}

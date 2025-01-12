package com.happyfood.accounts.repository;

import com.happyfood.accounts.entity.Rewards;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RewardsRepository extends JpaRepository<Rewards, Long> {
}

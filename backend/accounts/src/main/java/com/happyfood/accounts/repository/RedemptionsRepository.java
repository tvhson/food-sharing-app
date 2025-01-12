package com.happyfood.accounts.repository;

import com.happyfood.accounts.entity.Redemptions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RedemptionsRepository extends JpaRepository<Redemptions, Long> {
    List<Redemptions> findByAccountId(Long accountId);
}

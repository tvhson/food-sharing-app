package com.happyfood.accounts.controller;


import com.happyfood.accounts.dto.RedemptionsRequest;
import com.happyfood.accounts.dto.RewardsRequest;
import com.happyfood.accounts.entity.Points;
import com.happyfood.accounts.entity.Redemptions;
import com.happyfood.accounts.entity.Rewards;
import com.happyfood.accounts.exception.CustomException;
import com.happyfood.accounts.service.IPointsService;
import com.happyfood.accounts.service.IRewardsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/loyalty")
@RequiredArgsConstructor
public class LoyaltyController {
    private final IPointsService pointsService;
    private final IRewardsService rewardsService;

    @GetMapping("/points")
    public ResponseEntity<Points> getPoints(@RequestHeader Long userId) {
        return ResponseEntity.ok(pointsService.getPoints(userId));
    }

    @PostMapping("/points/add")
    public ResponseEntity<Points> addPoints(@RequestParam Long accountId, @RequestParam Long point) {
        return ResponseEntity.ok(pointsService.addPoints(accountId, point));
    }

    @GetMapping("/redemptions")
    public ResponseEntity<List<Redemptions>> getRedemptions(@RequestHeader Long userId) {
        return ResponseEntity.ok(pointsService.getRedemptions(userId));
    }

    @GetMapping("/allredemptions")
    public ResponseEntity<List<Redemptions>> getAllRedemptions(@RequestHeader String role) {
        if (!role.equals("ADMIN")) {
            throw new CustomException("You are not authorized to perform this action", HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(pointsService.getAllRedemptions());
    }

    @PostMapping("/redemptions/redeem")
    public ResponseEntity<Redemptions> redeemPoints(@RequestHeader Long userId, @RequestBody RedemptionsRequest redemptionsRequest) {
        pointsService.redeemPoints(userId, redemptionsRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/redemptions/{redemptionId}")
    public ResponseEntity<Redemptions> updateRedemption(@RequestHeader String role, @PathVariable Long redemptionId, @RequestBody Redemptions redemptions) {
        if (!role.equals("ADMIN")) {
            throw new CustomException("You are not authorized to perform this action", HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(pointsService.updateRedemption(redemptionId, redemptions));
    }

    @DeleteMapping("/redemptions/{redemptionId}")
    public ResponseEntity<Void> deleteRedemption(@RequestHeader String role, @PathVariable Long redemptionId) {
        if (!role.equals("ADMIN")) {
            throw new CustomException("You are not authorized to perform this action", HttpStatus.UNAUTHORIZED);
        }
        pointsService.deleteRedemption(redemptionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/rewards")
    public ResponseEntity<List<Rewards>> getRewards() {
        return ResponseEntity.ok(rewardsService.getAllRewards());
    }

    @GetMapping("/rewards/{rewardId}")
    public ResponseEntity<Rewards> getReward(@PathVariable Long rewardId) {
        return ResponseEntity.ok(rewardsService.getReward(rewardId));
    }

    @PostMapping("/rewards")
    public ResponseEntity<RewardsRequest> createReward(@RequestHeader String role, @RequestBody RewardsRequest rewards) {
        if (!role.equals("ADMIN")) {
            throw new CustomException("You are not authorized to perform this action", HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(rewardsService.createReward(rewards));
    }

    @PutMapping("/rewards/{rewardId}")
    public ResponseEntity<Rewards> updateReward(@RequestHeader String role, @PathVariable Long rewardId, @RequestBody Rewards rewards) {
        if (!role.equals("ADMIN")) {
            throw new CustomException("You are not authorized to perform this action", HttpStatus.UNAUTHORIZED);
        }
        return ResponseEntity.ok(rewardsService.updateReward(rewardId, rewards));
    }

    @DeleteMapping("/rewards/{rewardId}")
    public ResponseEntity<Void> deleteReward(@RequestHeader String role, @PathVariable Long rewardId) {
        if (!role.equals("ADMIN")) {
            throw new CustomException("You are not authorized to perform this action", HttpStatus.UNAUTHORIZED);
        }
        rewardsService.deleteReward(rewardId);
        return ResponseEntity.ok().build();
    }
}

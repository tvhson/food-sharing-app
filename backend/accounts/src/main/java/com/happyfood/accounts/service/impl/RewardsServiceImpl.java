package com.happyfood.accounts.service.impl;

import com.happyfood.accounts.dto.RedemptionsRequest;
import com.happyfood.accounts.dto.RewardsRequest;
import com.happyfood.accounts.entity.Rewards;
import com.happyfood.accounts.exception.CustomException;
import com.happyfood.accounts.repository.PointsRepository;
import com.happyfood.accounts.repository.RewardsRepository;
import com.happyfood.accounts.service.IMediaService;
import com.happyfood.accounts.service.IRewardsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RewardsServiceImpl implements IRewardsService {
     private final RewardsRepository rewardsRepository;
     private final PointsRepository pointsRepository;

     @Override
     public List<Rewards> getAllRewards() {
         return rewardsRepository.findAll();
     }

     @Override
     public Rewards getReward(Long rewardId) {
         return rewardsRepository.findById(rewardId).orElseThrow(() -> new CustomException("Không tìm thấy phần quà", HttpStatus.NOT_FOUND));
     }

     @Override
     public RewardsRequest createReward(RewardsRequest rewards) {
         List<Rewards> rewardsRes = new ArrayList<>();
         for (Rewards reward : rewards.getRewards()) {
             reward.setActive(true);
             reward.setCreatedDate(new Date());
             rewardsRes.add(rewardsRepository.save(reward));
         }
         return RewardsRequest.builder()
                 .rewards(rewardsRes)
                 .build();
     }

     @Override
     public Rewards updateReward(Long rewardId, Rewards rewards) {
         Rewards reward = rewardsRepository.findById(rewardId).orElseThrow(() -> new CustomException("Không tìm thấy phần quà", HttpStatus.NOT_FOUND));
         reward.setRewardName(rewards.getRewardName());
         reward.setRewardDescription(rewards.getRewardDescription());
         reward.setPointsRequired(rewards.getPointsRequired());
         reward.setImageUrl(rewards.getImageUrl());
         reward.setStockQuantity(rewards.getStockQuantity());
         reward.setActive(rewards.isActive());
         return rewardsRepository.save(reward);
     }

     @Override
     public void deleteReward(Long rewardId) {
         Rewards reward = rewardsRepository.findById(rewardId).orElseThrow(() -> new CustomException("Không tìm thấy phần quà", HttpStatus.NOT_FOUND));
         rewardsRepository.delete(reward);
     }
}

package com.happyfood.accounts.service;

import com.happyfood.accounts.dto.RedemptionsRequest;
import com.happyfood.accounts.dto.RewardsRequest;
import com.happyfood.accounts.entity.Rewards;

import java.util.List;

public interface IRewardsService {
    List<Rewards> getAllRewards();
    Rewards getReward(Long rewardId);
    RewardsRequest createReward(RewardsRequest rewards);
    Rewards updateReward(Long rewardId, Rewards rewards);
    void deleteReward(Long rewardId);
}

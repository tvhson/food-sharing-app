package com.happyfood.accounts.service.impl;

import com.happyfood.accounts.dto.RedemptionsRequest;
import com.happyfood.accounts.entity.Points;
import com.happyfood.accounts.entity.Redemptions;
import com.happyfood.accounts.entity.Rewards;
import com.happyfood.accounts.entity.Transactions;
import com.happyfood.accounts.exception.CustomException;
import com.happyfood.accounts.repository.PointsRepository;
import com.happyfood.accounts.repository.RedemptionsRepository;
import com.happyfood.accounts.repository.RewardsRepository;
import com.happyfood.accounts.repository.TransactionsRepository;
import com.happyfood.accounts.service.IPointsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointsServiceImpl implements IPointsService {
    private final PointsRepository pointsRepository;
    private final RedemptionsRepository redemptionsRepository;
    private final RewardsRepository rewardsRepository;
    private final TransactionsRepository transactionsRepository;

    @Override
    public Points getPoints(Long accountId) {
        Points points = pointsRepository.findByAccountId(accountId).orElse(null);
        if (points == null) {
            points = Points.builder()
                    .accountId(accountId)
                    .pointsEarned(0L)
                    .pointsRedeemed(0L)
                    .pointsBalance(0L)
                    .createdDate(new Date())
                    .transactionDate(new Date())
                    .build();
            pointsRepository.save(points);
        }

        return points;
    }

    @Override
    public Points addPoints(Long accountId, Long point) {
        Points pointsEntity = pointsRepository.findByAccountId(accountId).orElseThrow(() -> new CustomException("Không tìm thấy thông tin điểm", HttpStatus.NOT_FOUND));
        pointsEntity.setPointsEarned(pointsEntity.getPointsEarned() + point);
        pointsEntity.setPointsBalance(pointsEntity.getPointsBalance() + point);
        pointsEntity.setTransactionDate(new Date());

        Transactions transaction = Transactions.builder()
                .accountId(accountId)
                .transactionType("EARN")
                .points(point)
                .createdDate(new Date())
                .build();
        transactionsRepository.save(transaction);

        return pointsRepository.save(pointsEntity);
    }

    @Override
    public void redeemPoints(Long accountId, RedemptionsRequest redemptionsRequest) {
        Points pointsEntity = pointsRepository.findByAccountId(accountId).orElseThrow(() -> new CustomException("Không tìm thấy thông tin điểm", HttpStatus.NOT_FOUND));
        pointsEntity.setPointsRedeemed(pointsEntity.getPointsRedeemed() + redemptionsRequest.getPoint());
        pointsEntity.setPointsBalance(pointsEntity.getPointsBalance() - redemptionsRequest.getPoint());

        Rewards rewards = rewardsRepository.findById(redemptionsRequest.getRewardId()).orElseThrow(() -> new RuntimeException("Reward not found"));
        rewards.setStockQuantity(rewards.getStockQuantity() - (int) (redemptionsRequest.getPoint() / rewards.getPointsRequired()));
        if (rewards.getStockQuantity() <= 0) throw new CustomException("Kho không đủ phần quà nhé!", HttpStatus.BAD_REQUEST);
        pointsRepository.save(pointsEntity);
        rewardsRepository.save(rewards);

        Redemptions redemptions = Redemptions.builder()
                .accountId(accountId)
                .rewardId(redemptionsRequest.getRewardId())
                .rewardName(rewards.getRewardName())
                .imageUrl(rewards.getImageUrl())
                .pointsUsed(redemptionsRequest.getPoint())
                .location(redemptionsRequest.getLocation())
                .phone(redemptionsRequest.getPhone())
                .quantity(rewards.getStockQuantity())
                .createdDate(new Date())
                .status("PENDING")
                .build();
        redemptionsRepository.save(redemptions);

        Transactions transaction = Transactions.builder()
                .accountId(accountId)
                .transactionType("REDEEM")
                .points(redemptionsRequest.getPoint())
                .createdDate(new Date())
                .build();
        transactionsRepository.save(transaction);
    }

    @Override
    public List<Redemptions> getRedemptions(Long accountId) {
        List<Redemptions> redemptions = redemptionsRepository.findByAccountId(accountId);
        redemptions.sort((o1, o2) -> o2.getCreatedDate().compareTo(o1.getCreatedDate()));
        return redemptions;
    }

    @Override
    public Redemptions updateRedemption(Long redemptionId, Redemptions redemptions) {
        Redemptions redemptionsEntity = redemptionsRepository.findById(redemptionId).orElseThrow(() -> new CustomException("Không tìm thấy lịch sử", HttpStatus.NOT_FOUND));
//        redemptionsEntity.setRewardId(redemptions.getRewardId());
//        redemptionsEntity.setRewardName(redemptions.getRewardName());
//        redemptionsEntity.setImageUrl(redemptions.getImageUrl());
//        redemptionsEntity.setPointsUsed(redemptions.getPointsUsed());
//        redemptionsEntity.setQuantity(redemptions.getQuantity());
//        redemptionsEntity.setPhone(redemptions.getPhone());
//        redemptionsEntity.setLocation(redemptions.getLocation());
        redemptionsEntity.setStatus(redemptions.getStatus());
        return redemptionsRepository.save(redemptionsEntity);
    }

    @Override
    public void deleteRedemption(Long redemptionId) {
        redemptionsRepository.deleteById(redemptionId);
    }

    @Override
    public List<Redemptions> getAllRedemptions() {
        List<Redemptions> redemptions = redemptionsRepository.findAll();
        redemptions.sort((o1, o2) -> o2.getCreatedDate().compareTo(o1.getCreatedDate()));
        return redemptions;
    }
}

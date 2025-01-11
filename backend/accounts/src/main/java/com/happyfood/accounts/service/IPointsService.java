package com.happyfood.accounts.service;

import com.happyfood.accounts.dto.RedemptionsRequest;
import com.happyfood.accounts.entity.Points;
import com.happyfood.accounts.entity.Redemptions;

import java.util.List;

public interface IPointsService {
    Points getPoints(Long accountId);
    Points addPoints(Long accountId, Long point);
    void redeemPoints(Long accountId, RedemptionsRequest redemptionsRequest);
    List<Redemptions> getRedemptions(Long accountId);
    Redemptions updateRedemption(Long redemptionId, Redemptions redemptions);
    void deleteRedemption(Long redemptionId);
    List<Redemptions> getAllRedemptions();
}

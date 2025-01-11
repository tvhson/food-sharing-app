package com.happyfood.accounts.dto;

import com.happyfood.accounts.entity.Rewards;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RewardsRequest {
    private List<Rewards> rewards;
}

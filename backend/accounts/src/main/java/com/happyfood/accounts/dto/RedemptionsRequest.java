package com.happyfood.accounts.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RedemptionsRequest {
    private Long point;
    private Long rewardId;
    private String location;
    private String phone;
}

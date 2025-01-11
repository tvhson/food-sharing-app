package com.happyfood.accounts.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "redemptions")
public class Redemptions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long accountId;
    private Long rewardId;
    private String rewardName;
    private String imageUrl;
    private Long pointsUsed;
    private int quantity;
    private String phone;
    private String location;
    private String status;
    private Date createdDate;
}


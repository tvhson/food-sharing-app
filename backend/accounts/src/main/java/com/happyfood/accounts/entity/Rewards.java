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
@Table(name = "rewards")
public class Rewards {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String rewardName;
    private String rewardDescription;
    private String imageUrl;
    private Long pointsRequired;
    private int stockQuantity;
    private Date createdDate;
    private boolean isActive;
}

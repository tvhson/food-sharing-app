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
@Table(name = "points")
public class Points {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long accountId;
    private Long pointsEarned;
    private Long pointsRedeemed;
    private Long pointsBalance;
    private Date createdDate;
    private Date transactionDate;
}

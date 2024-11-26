package com.happyfood.accounts.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "accounts")
public class Accounts{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String password;
    private String name;
    private String role;
    private LocalDate birthDate;
    private String imageUrl;
    private String phone;
    private String description;
    private String status;
    private Date bannedDate;
    private String locationName;
    private String latitude;
    private String longitude;
    private Date createdDate;
    private Boolean isVegan;
    private Boolean isChosenTag;
}

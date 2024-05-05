package com.happyfood.posts.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "posts")
public class Posts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String content;
    private String imageUrl;
    private String weight;
    private String description;
    private String note;
    private Date expiredDate;
    private Date pickUpStartDate;
    private Date pickUpEndDate;
    private String status;
    private boolean isDeleted;
    private String latitude;
    private String longitude;
    private Long createdById;
    private Long receiverId;
    @CreatedDate
    @Column(updatable = false)
    private Date createdDate;
}

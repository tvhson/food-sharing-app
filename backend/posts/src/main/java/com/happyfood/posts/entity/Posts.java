package com.happyfood.posts.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

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
    private String weight;
    private String description;
    private String note;
    private Date expiredDate;
    private Date pickUpStartDate;
    private Date pickUpEndDate;
    private String status;
    private boolean isDeleted;
    private String locationName;
    private String latitude;
    private String longitude;
    private Long createdById;
    private Long receiverId;
    private Date createdDate;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Images> images;

}
package com.happyfood.posts.dto;

import jakarta.persistence.Column;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostsDto {
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
    private String locationName;
    private String latitude;
    private String longitude;
    private double distance;
    private Long createdById;
    private Long receiverId;
    private Date createdDate;
}

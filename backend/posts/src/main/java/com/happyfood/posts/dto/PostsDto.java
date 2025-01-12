package com.happyfood.posts.dto;

import jakarta.persistence.Column;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostsDto {
    private Long id;
    private String title;
    private String content;
    private List<String> images;
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
    private int portion;
    private List<String> tags;
    private Boolean isLiked;
    private Boolean isReceived;
    private int likeCount;
}
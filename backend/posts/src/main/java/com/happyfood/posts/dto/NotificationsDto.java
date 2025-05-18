package com.happyfood.posts.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationsDto {
    private Long id;
    private String title;
    private String imageUrl;
    private String description;
    private String type;
    private boolean isRead;
    private Date createdDate;
    private Long linkId;
    private Long userId;
    private Long senderId;
}

package com.happyfood.posts.dto;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrganizationpostsDto {
    private Long id;
    private String title;
    private String description;
    private int peopleAttended;
    private String imageUrl;
    private String linkWebsites;
    private Long userId;
    private String locationName;
    private String latitude;
    private String longitude;
    private double distance;
    private boolean isAttended;
    private Date createdDate;
    private Date startDate;
    private Long groupId;
}

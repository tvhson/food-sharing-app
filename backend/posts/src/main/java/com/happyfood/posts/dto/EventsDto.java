package com.happyfood.posts.dto;

import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EventsDto {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private Date startDate;
    private Date endDate;
    private Date startTime;
    private Date endTime;
    private Double distance;
    private String status;
    private List<Integer> repeatDays;
    private AccountsDto author;
    private Date createdDate;
}

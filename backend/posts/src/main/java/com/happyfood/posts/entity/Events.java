package com.happyfood.posts.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "events")
public class Events {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String imageUrl;
    private String description;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private Date startDate;
    private Date endDate;
    private Date startTime;
    private Date endTime;
    private String repeatDays;
    private Long authorId;
    private Date createdDate;
}

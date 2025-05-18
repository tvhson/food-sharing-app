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
@Table(name = "groupss")
public class Groups {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String memberIds;
    private String requestIds;
    private String joinType;
    private String imageUrl;
    private Long authorId;
    private Date createdDate;
    private Date startDate;
    private Date endDate;
}

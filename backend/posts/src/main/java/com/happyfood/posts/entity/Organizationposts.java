package com.happyfood.posts.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "organization_posts")
public class Organizationposts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private Date createdDate;
    private boolean isDeleted;
    private String linkWebsites;
    private Long userId;
    private String locationName;
    private String latitude;
    private String longitude;

    @OneToMany(mappedBy = "organizationPost", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<AttendeeId> attendees;
}

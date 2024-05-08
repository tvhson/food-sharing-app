package com.happyfood.organizationposts.entity;

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
    private int peopleAttended;
    private String imageUrl;
    private Date createdDate;
    private boolean isDeleted;
    private String linkWebsites;
    private Long userId;

    @OneToMany(mappedBy = "organizationPost")
    private List<AttendeeId> attendees;
}

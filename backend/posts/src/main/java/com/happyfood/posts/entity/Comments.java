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
@Table(name = "comments")
public class Comments {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private String userName;
    private String avatar;
    private Date createdDate;
    private String userIdLikes;
    private Long userId;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Posts post;
}

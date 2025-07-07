package com.happyfood.posts.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StatisticalUser {
    private Long id;
    private String name;
    private String imageUrl;
    private String locationName;
    private String latitude;
    private String longitude;
    // số người đã giúp đỡ
    private Integer totalAssistedPeople;
    // số bài viết đã đăng
    private Integer totalPosts;
}

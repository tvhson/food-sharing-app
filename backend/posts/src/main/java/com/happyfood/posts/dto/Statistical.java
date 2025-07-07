package com.happyfood.posts.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Statistical {
    private Integer totalPosts;
    private Integer totalEvents;
    private Integer totalAssistedPeople;
    private List<StatisticalUser> topUsers;

    private Integer totalPostsYou;
    private Integer totalAssistedPeopleYou;
}

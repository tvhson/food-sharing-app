package com.happyfood.posts.mapper;

import com.happyfood.posts.dto.PostsDto;
import com.happyfood.posts.entity.Images;
import com.happyfood.posts.entity.Posts;

import java.util.stream.Collectors;

public class PostsMapper {
    public static Posts mapToPosts(PostsDto postsDto) {
        return Posts.builder()
                .id(postsDto.getId())
                .title(postsDto.getTitle())
                .content(postsDto.getContent())
                .weight(postsDto.getWeight())
                .description(postsDto.getDescription())
                .note(postsDto.getNote())
                .expiredDate(postsDto.getExpiredDate())
                .pickUpStartDate(postsDto.getPickUpStartDate())
                .pickUpEndDate(postsDto.getPickUpEndDate())
                .status(postsDto.getStatus())
                .locationName(postsDto.getLocationName())
                .latitude(postsDto.getLatitude())
                .longitude(postsDto.getLongitude())
                .createdById(postsDto.getCreatedById())
                .receiverId(postsDto.getReceiverId())
                .build();
    }
    public static PostsDto mapToPostsDto(Posts posts) {
        return PostsDto.builder()
                .id(posts.getId())
                .title(posts.getTitle())
                .content(posts.getContent())
                .images(posts.getImages() != null ? posts.getImages().stream().map(Images::getUrl).collect(Collectors.toList()) : null)
                .weight(posts.getWeight())
                .description(posts.getDescription())
                .note(posts.getNote())
                .expiredDate(posts.getExpiredDate())
                .pickUpStartDate(posts.getPickUpStartDate())
                .pickUpEndDate(posts.getPickUpEndDate())
                .status(posts.getStatus())
                .locationName(posts.getLocationName())
                .latitude(posts.getLatitude())
                .longitude(posts.getLongitude())
                .createdById(posts.getCreatedById())
                .receiverId(posts.getReceiverId())
                .createdDate(posts.getCreatedDate())
                .build();
    }
}
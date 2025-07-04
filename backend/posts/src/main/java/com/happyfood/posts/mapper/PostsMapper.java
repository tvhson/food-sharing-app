package com.happyfood.posts.mapper;

import com.happyfood.posts.dto.PostsDto;
import com.happyfood.posts.entity.Images;
import com.happyfood.posts.entity.Posts;

import java.util.Arrays;
import java.util.List;
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
                    .receiverId(postsDto.getReceiverId())
                    .portion(postsDto.getPortion())
                    .type(postsDto.getType())
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
                       .receiverId(posts.getReceiverId())
                       .createdDate(posts.getCreatedDate())
                       .portion(posts.getPortion())
                       .tags(posts.getTags() != null && !posts.getTags().isEmpty() ? Arrays.asList(posts.getTags().split("-")) : null)
                       .isLiked(false)
                       .isReceived(false)
                       .likeCount(posts.getUserIdLikes() != null && !posts.getUserIdLikes().isEmpty() ? Arrays.asList(posts.getUserIdLikes().split("-")).size() : 0)
                       .type(posts.getType())
                       .AIComments(posts.getAiComments() != null && !posts.getAiComments().isEmpty()
                                   ? Arrays.asList(posts.getAiComments().split("-"))
                                   : null)
                       .build();
    }
}
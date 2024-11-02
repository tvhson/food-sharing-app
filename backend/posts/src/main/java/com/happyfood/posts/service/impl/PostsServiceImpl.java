package com.happyfood.posts.service.impl;

import com.happyfood.posts.dto.Coordinates;
import com.happyfood.posts.dto.PostsDto;
import com.happyfood.posts.entity.Images;
import com.happyfood.posts.entity.Posts;
import com.happyfood.posts.exception.CustomException;
import com.happyfood.posts.mapper.PostsMapper;
import com.happyfood.posts.repository.PostsRepository;
import com.happyfood.posts.service.IPostsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PostsServiceImpl implements IPostsService {
    private final PostsRepository postsRepository;
    @Override
    public PostsDto createPost(Long userId, PostsDto postsDto) {
        Posts posts = PostsMapper.mapToPosts(postsDto);
        posts.setDeleted(false);
        posts.setCreatedById(userId);
        posts.setCreatedDate(new Date());

        posts.setImages(new ArrayList<>());
        for (String imageUrl : postsDto.getImages()) {
            posts.getImages().add(Images.builder().url(imageUrl).post(posts).build());
        }

        return PostsMapper.mapToPostsDto(postsRepository.save(posts));
    }

    @Override
    public PostsDto updatePostById(Long userId, PostsDto postsDto, Long postId) {
        Posts posts = postsRepository.findById(postId).orElseThrow(() -> new CustomException("Post not found", HttpStatus.NOT_FOUND));
        if (!Objects.equals(posts.getCreatedById(), userId)) {
            throw new CustomException("You are not allowed to update this post", HttpStatus.FORBIDDEN);
        }
        posts.setTitle(postsDto.getTitle());
        posts.setContent(postsDto.getContent());
        posts.setWeight(postsDto.getWeight());
        posts.setDescription(postsDto.getDescription());
        posts.setNote(postsDto.getNote());
        posts.setExpiredDate(postsDto.getExpiredDate());
        posts.setPickUpStartDate(postsDto.getPickUpStartDate());
        posts.setPickUpEndDate(postsDto.getPickUpEndDate());
        posts.setStatus(postsDto.getStatus());
        posts.setLocationName(postsDto.getLocationName());
        posts.setLatitude(postsDto.getLatitude());
        posts.setLongitude(postsDto.getLongitude());
        posts.setReceiverId(postsDto.getReceiverId());

        posts.getImages().clear();
        for (String imageUrl : postsDto.getImages()) {
            posts.getImages().add(Images.builder().url(imageUrl).post(posts).build());
        }

        return PostsMapper.mapToPostsDto(postsRepository.save(posts));
    }

    @Override
    public void deletePostById(Long userId, Long postId) {
        Posts posts = postsRepository.findById(postId).orElseThrow(() -> new CustomException("Post not found", HttpStatus.NOT_FOUND));
        if (!Objects.equals(posts.getCreatedById(), userId)) {
            throw new CustomException("You are not allowed to delete this post", HttpStatus.FORBIDDEN);
        }
        posts.setDeleted(true);
        postsRepository.save(posts);
    }

    @Override
    public PostsDto getPostById(Long postId) {
        return PostsMapper.mapToPostsDto(postsRepository.findById(postId).orElseThrow(() -> new CustomException("Post not found", HttpStatus.NOT_FOUND)));
    }

    @Override
    public List<PostsDto> getRecommendedPosts(Long userI ) {
        List<Posts> posts = postsRepository.findAll();

//        double latitude = Double.parseDouble(location.getLatitude());
//        double longitude = Double.parseDouble(location.getLongitude());

        List<PostsDto> recommendedPosts = new ArrayList<>(posts.stream()
                .filter(post -> !post.isDeleted())
                .filter(post -> !post.getStatus().equals("RECEIVED"))
                .map(PostsMapper::mapToPostsDto)
//                .filter(post -> post.getReceiverId() == null)
//                .filter(post -> post.getLatitude() != null)
//                .filter(post -> post.getLongitude() != null)
//                .filter(post -> {
//                    double postLatitude = Double.parseDouble(post.getLatitude());
//                    double postLongitude = Double.parseDouble(post.getLongitude());
//                    double distance = Math.sqrt(Math.pow(latitude - postLatitude, 2) + Math.pow(longitude - postLongitude, 2)) * 1.60934;
//                    post.setDistance(distance);
//                    return distance < 25;
//                })
                .toList());
        Collections.reverse(recommendedPosts);
        return recommendedPosts;
    }

    @Override
    public List<PostsDto> getPostsOfUser(Long userId) {
        List<Posts> posts = postsRepository.findAllByCreatedById(userId);
        Collections.reverse(posts);
        return posts.stream()
                .filter(post -> !post.isDeleted())
                .map(PostsMapper::mapToPostsDto).toList();
    }
}
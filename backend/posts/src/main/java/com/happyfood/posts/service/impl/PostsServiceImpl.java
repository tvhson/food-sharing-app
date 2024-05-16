package com.happyfood.posts.service.impl;

import com.happyfood.posts.dto.PostsDto;
import com.happyfood.posts.entity.Posts;
import com.happyfood.posts.exception.CustomException;
import com.happyfood.posts.mapper.PostsMapper;
import com.happyfood.posts.repository.PostsRepository;
import com.happyfood.posts.service.IPostsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;

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
        posts.setImageUrl(postsDto.getImageUrl());
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
    public List<PostsDto> getRecommendedPosts(Long userId) {
        List<Posts> posts = postsRepository.findAll();
        Collections.reverse(posts);
        return posts.stream()
                .filter(post -> !post.isDeleted())
                .map(PostsMapper::mapToPostsDto).toList();
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

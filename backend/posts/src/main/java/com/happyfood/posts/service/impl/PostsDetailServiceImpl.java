package com.happyfood.posts.service.impl;

import com.happyfood.posts.dto.AccountsDto;
import com.happyfood.posts.dto.PostsDetailDto;
import com.happyfood.posts.entity.Posts;
import com.happyfood.posts.exception.CustomException;
import com.happyfood.posts.mapper.PostsMapper;
import com.happyfood.posts.repository.PostsRepository;
import com.happyfood.posts.service.IPostsDetailService;
import com.happyfood.posts.service.client.AccountsFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostsDetailServiceImpl implements IPostsDetailService {
    private final PostsRepository postsRepository;
    private final AccountsFeignClient accountsFeignClient;
    @Override
    public PostsDetailDto getPostDetailById(Long postId) {
        PostsDetailDto postsDetailDto = new PostsDetailDto();
        Posts posts = postsRepository.findById(postId).orElseThrow(() -> new CustomException("Không tìm thấy bài viết", HttpStatus.NOT_FOUND));
        postsDetailDto.setPost(PostsMapper.mapToPostsDto(posts));
        ResponseEntity<AccountsDto> accountsDtoResponseEntity = accountsFeignClient.getAccount(posts.getCreatedById());
        if (accountsDtoResponseEntity != null && accountsDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
            postsDetailDto.setAccount(accountsDtoResponseEntity.getBody());
        }
        return postsDetailDto;
    }
}

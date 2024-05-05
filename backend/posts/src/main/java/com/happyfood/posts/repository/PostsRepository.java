package com.happyfood.posts.repository;

import com.happyfood.posts.entity.Posts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostsRepository extends JpaRepository<Posts, Long> {
    List<Posts> findAllByCreatedById(Long userId);
}

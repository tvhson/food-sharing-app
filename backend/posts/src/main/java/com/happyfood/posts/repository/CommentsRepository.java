package com.happyfood.posts.repository;

import com.happyfood.posts.entity.Comments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentsRepository extends JpaRepository<Comments, Long> {
    List<Comments> findByPostId(Long postId);
}

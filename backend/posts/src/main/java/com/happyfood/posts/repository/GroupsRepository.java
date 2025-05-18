package com.happyfood.posts.repository;

import com.happyfood.posts.entity.Groups;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GroupsRepository extends JpaRepository<Groups, Long> {
    List<Groups> findByAuthorId(Long authorId);
}

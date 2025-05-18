package com.happyfood.posts.repository;

import com.happyfood.posts.entity.Todos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodosRepository extends JpaRepository<Todos, Long> {
    List<Todos> findByGroupId(Long groupId);
}

package com.happyfood.posts.repository;

import com.happyfood.posts.entity.Statements;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StatementsRepository extends JpaRepository<Statements, Long> {
     List<Statements> findByGroupId(Long groupId);
}

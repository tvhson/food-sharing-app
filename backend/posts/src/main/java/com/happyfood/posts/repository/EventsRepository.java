package com.happyfood.posts.repository;

import com.happyfood.posts.entity.Events;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventsRepository extends JpaRepository<Events, Long> {
}

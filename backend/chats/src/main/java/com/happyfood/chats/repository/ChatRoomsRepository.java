package com.happyfood.chats.repository;

import com.happyfood.chats.entity.ChatRooms;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRoomsRepository extends JpaRepository<ChatRooms, Long> {
    @Query("SELECT cr FROM ChatRooms cr WHERE (cr.senderId = :senderId AND cr.recipientId = :recipientId) OR (cr.senderId = :recipientId AND cr.recipientId = :senderId)")
    Optional<ChatRooms> findBySenderIdAndRecipientId(Long senderId, Long recipientId);

    @Query("SELECT cr FROM ChatRooms cr WHERE cr.senderId = :userId OR cr.recipientId = :userId")
    List<ChatRooms> findByUserId(Long userId);
}

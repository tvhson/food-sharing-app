package com.happyfood.chats.service.impl;

import com.happyfood.chats.dto.AccountsDto;
import com.happyfood.chats.entity.ChatMessages;
import com.happyfood.chats.entity.ChatRooms;
import com.happyfood.chats.exception.CustomException;
import com.happyfood.chats.repository.ChatMessagesRepository;
import com.happyfood.chats.repository.ChatRoomsRepository;
import com.happyfood.chats.service.IChatsService;
import com.happyfood.chats.service.client.AccountsFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ChatsService implements IChatsService {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatRoomsRepository chatRoomsRepository;
    private final ChatMessagesRepository chatMessagesRepository;
    private final AccountsFeignClient accountsFeignClient;

    @Override
    public void sendMessage(Long userId, ChatMessages chatMessage) {
        ChatRooms chatRooms = chatRoomsRepository.findBySenderIdAndRecipientId(chatMessage.getSenderId(), chatMessage.getRecipientId())
                .orElseGet(() -> {
                    ChatRooms chatRoom = ChatRooms.builder()
                            .senderId(chatMessage.getSenderId())
                            .recipientId(chatMessage.getRecipientId())
                            .status("ACTIVE")
                            .build();

                    ResponseEntity<AccountsDto> senderDtoResponseEntity = accountsFeignClient.getAccount(chatRoom.getSenderId());
                    if (senderDtoResponseEntity != null && senderDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
                        AccountsDto senderDto = senderDtoResponseEntity.getBody();
                        assert senderDto != null;
                        chatRoom.setSenderName(senderDto.getName());
                        chatRoom.setSenderProfilePic(senderDto.getImageUrl());
                    }

                    ResponseEntity<AccountsDto> recipientDtoResponseEntity = accountsFeignClient.getAccount(chatRoom.getRecipientId());
                    if (recipientDtoResponseEntity != null && recipientDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
                        AccountsDto recipientDto = recipientDtoResponseEntity.getBody();
                        assert recipientDto != null;
                        chatRoom.setRecipientName(recipientDto.getName());
                        chatRoom.setRecipientProfilePic(recipientDto.getImageUrl());
                    }
                    return chatRoomsRepository.save(chatRoom);
                });
        if (!Objects.equals(chatRooms.getRecipientId(), chatMessage.getSenderId())) {
            chatRooms.setSenderStatus("READ");
            chatRooms.setRecipientStatus("UNREAD");
        } else {
            chatRooms.setSenderStatus("UNREAD");
            chatRooms.setRecipientStatus("READ");
        }
        chatRooms.setLastMessage(chatMessage.getContent());
        chatRooms.setLastMessageCreatedDate(new Date());
        chatRooms.setLastMessageSenderId(chatMessage.getSenderId());
        chatRoomsRepository.save(chatRooms);

        chatMessage.setChatRoomId(chatRooms.getId());
        chatMessage.setTimestamp(new Date());
        chatMessage.setStatus("DELIVERED");
        chatMessagesRepository.save(chatMessage);

        simpMessagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId().toString(), "/queue/rooms",
                chatRooms); // send room to sender
        simpMessagingTemplate.convertAndSendToUser(
                chatMessage.getChatRoomId().toString(), "/queue/messages",
                chatMessage); // send message to recipient
    }

    @Override
    public List<ChatMessages> getChatMessages(Long userId, Long chatId) {
        return chatMessagesRepository.findByChatRoomId(chatId);
    }

    @Override
    public List<ChatRooms> getChatRooms(Long userId) {
        List<ChatRooms> chatRooms = chatRoomsRepository.findByUserId(userId);

        for (ChatRooms chatRoom : chatRooms) {
            ResponseEntity<AccountsDto> senderDtoResponseEntity = accountsFeignClient.getAccount(chatRoom.getSenderId());
            if (senderDtoResponseEntity != null && senderDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
                AccountsDto senderDto = senderDtoResponseEntity.getBody();
                assert senderDto != null;
                chatRoom.setSenderName(senderDto.getName());
                chatRoom.setSenderProfilePic(senderDto.getImageUrl());
            }

            ResponseEntity<AccountsDto> recipientDtoResponseEntity = accountsFeignClient.getAccount(chatRoom.getRecipientId());
            if (recipientDtoResponseEntity != null && recipientDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
                AccountsDto recipientDto = recipientDtoResponseEntity.getBody();
                assert recipientDto != null;
                chatRoom.setRecipientName(recipientDto.getName());
                chatRoom.setRecipientProfilePic(recipientDto.getImageUrl());
            }
        }

        chatRooms.sort((o1, o2) -> {
            if (o1.getLastMessageCreatedDate() == null || o2.getLastMessageCreatedDate() == null) {
                return 0;
            }
            return o2.getLastMessageCreatedDate().compareTo(o1.getLastMessageCreatedDate());
        });

        return chatRooms;
    }

    @Override
    public void updateStatuses(Long userId, Long chatId) {
        ChatRooms chatRooms = chatRoomsRepository.findById(chatId).orElseThrow(() -> new CustomException("Không tìm thấy phòng chat", HttpStatus.NOT_FOUND));

        if (Objects.equals(chatRooms.getRecipientId(), userId)) {
            chatRooms.setRecipientStatus("READ");
        } else {
            chatRooms.setSenderStatus("READ");
        }
        chatRoomsRepository.save(chatRooms);
    }

    @Override
    public ChatRooms updateChatRoom(Long userId, Long chatId, String status) {
        ChatRooms chatRooms = chatRoomsRepository.findById(chatId).orElseThrow(() -> new CustomException("Không tìm thấy phòng chat", HttpStatus.NOT_FOUND));
        chatRooms.setSenderStatus(status);
        chatRoomsRepository.save(chatRooms);
        return chatRooms;
    }
}

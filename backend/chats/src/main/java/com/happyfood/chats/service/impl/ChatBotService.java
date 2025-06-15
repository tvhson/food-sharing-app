package com.happyfood.chats.service.impl;

import com.happyfood.chats.dto.ChatBotDto;
import com.happyfood.chats.dto.ChatBotMessage;
import com.happyfood.chats.dto.ChatBotRequest;
import com.happyfood.chats.dto.ChatBotResponse;
import com.happyfood.chats.entity.ChatBotHistory;
import com.happyfood.chats.entity.ChatMessages;
import com.happyfood.chats.exception.CustomException;
import com.happyfood.chats.repository.ChatBotHistoryRepository;
import com.happyfood.chats.service.IChatBotService;
import com.happyfood.chats.util.ChatBotRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ChatBotService implements IChatBotService {
    @Qualifier("openaiRestTemplate")
    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ChatBotHistoryRepository chatBotHistoryRepository;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.api.model_3_5_turbo.name}")
    private String model;

    @Value("${openai.api.model_3_5_turbo.prompt}")
    private String prompt;

    @Override
    public ChatBotDto chat(String content, Long userId) {
        List<ChatBotMessage> chatMessages = new ArrayList<>();
        // Set the scene
        ChatBotMessage message = new ChatBotMessage();
        message.setRole(ChatBotRole.SYSTEM.getValue());
        message.setContent(prompt);
        chatMessages.add(message);

        List<ChatBotHistory> chatBotHistories = chatBotHistoryRepository.findByUserId(userId);
        for (ChatBotHistory chatBotHistory : chatBotHistories) {
            ChatBotMessage chatBotMessage = new ChatBotMessage();
            chatBotMessage.setRole(ChatBotRole.USER.getValue());
            if (Objects.equals(chatBotHistory.getRole(), ChatBotRole.ASSISTANT.getValue())) {
                chatBotMessage.setRole(ChatBotRole.ASSISTANT.getValue());
            }
            chatBotMessage.setContent(chatBotHistory.getContent());
            chatMessages.add(chatBotMessage);
        }

        // Set the user message
        ChatBotMessage userMessage = new ChatBotMessage();
        userMessage.setRole(ChatBotRole.USER.getValue());
        userMessage.setContent(content);
        chatMessages.add(userMessage);
        // Create the request object
        ChatBotRequest request = ChatBotRequest.builder()
                                               .model(model)
                                               .messages(chatMessages)
                                               .n(1)
                                               .temperature(0.6)
                                               .build();

        // Send the request to the OpenAI API
        ChatBotResponse response = restTemplate.postForObject(apiUrl, request, ChatBotResponse.class);

        if (response == null || response.getChoices() == null || response.getChoices().isEmpty()) {
            throw new CustomException("Failed to get a response from the OpenAI API", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        chatBotHistoryRepository.save(ChatBotHistory.builder()
                                                    .userId(userId)
                                                    .content(content)
                                                    .userId(userId)
                                                    .createdDate(new Date())
                                                    .role(ChatBotRole.USER.getValue())
                                                    .build());

        chatBotHistoryRepository.save(ChatBotHistory.builder()
                                                    .userId(userId)
                                                    .content(response.getChoices().get(0).getMessage().getContent())
                                                    .role(ChatBotRole.ASSISTANT.getValue())
                                                    .userId(userId)
                                                    .createdDate(new Date())
                                                    .build());

        // return response.getChoices().get(0).getMessage().getContent();
        return ChatBotDto.builder()
                         .content(response.getChoices().get(0).getMessage().getContent())
                         .role(ChatBotRole.ASSISTANT.getValue())
                         .createdDate(new Date())
                         .build();
    }

    @Override
    public List<ChatBotDto> getHistory(Long userId) {
        List<ChatBotHistory> chatBotHistories = chatBotHistoryRepository.findByUserId(userId);
        List<ChatBotDto> chatMessages = new ArrayList<>();

        String helloMessage = "## 👋 Chào bạn, tôi là trợ lý ảo của HappyFood. Tôi có thể giúp gì cho bạn hôm nay?";
        chatMessages.add(ChatBotDto.builder()
                                   .content(helloMessage)
                                   .role(ChatBotRole.ASSISTANT.getValue())
                                   .build());

        String beginningMessage = "## ❓ Bạn muốn hỏi về \n"
                                  + "- ➡️ Chính sách đổi điểm thưởng \n"
                                  + "- ➡️ Chính sách khiếu nại \n"
                                  + "- ➡️ Cách giao nhận thức ăn \n"
                                  + "- ❔ Câu hỏi thường gặp \n";
        chatMessages.add(ChatBotDto.builder()
                                   .content(beginningMessage)
                                   .role(ChatBotRole.ASSISTANT.getValue())
                                   .build());

        for (ChatBotHistory chatBotHistory : chatBotHistories) {
            chatMessages.add(ChatBotDto.builder()
                                       .content(chatBotHistory.getContent())
                                       .role(chatBotHistory.getRole())
                                       .createdDate(chatBotHistory.getCreatedDate())
                                       .build());
        }

        Collections.reverse(chatMessages);

        return chatMessages;
    }
}

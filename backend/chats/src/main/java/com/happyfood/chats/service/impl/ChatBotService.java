package com.happyfood.chats.service.impl;

import com.happyfood.chats.dto.ChatBotMessage;
import com.happyfood.chats.dto.ChatBotRequest;
import com.happyfood.chats.dto.ChatBotResponse;
import com.happyfood.chats.exception.CustomException;
import com.happyfood.chats.service.IChatBotService;
import com.happyfood.chats.util.ChatBotRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class ChatBotService implements IChatBotService {
    @Qualifier("openaiRestTemplate")
    @Autowired
    private RestTemplate restTemplate;

    @Value("${openai.api.url}")
    private String apiUrl;

    @Value("${openai.api.model}")
    private String model;

    @Value("${openai.api.prompt}")
    private String prompt;

    @Override
    public ChatBotResponse chat(String content) {
        // Set the scene
        ChatBotMessage message = new ChatBotMessage();
        message.setRole(ChatBotRole.SYSTEM);
        message.setContent(prompt);

        // Set the user message
        ChatBotMessage userMessage = new ChatBotMessage();
        userMessage.setRole(ChatBotRole.USER);
        userMessage.setContent(content);

        // Create the request object
        ChatBotRequest request = ChatBotRequest.builder()
                .model(model)
                .messages(List.of(message, userMessage))
                .n(1)
//                .temperature(1)
                .build();

        // Send the request to the OpenAI API
        ChatBotResponse response = restTemplate.postForObject(apiUrl, request, ChatBotResponse.class);

        if (response == null || response.getChoices() == null || response.getChoices().isEmpty()) {
            throw new CustomException("Failed to get a response from the OpenAI API", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // return response.getChoices().get(0).getMessage().getContent();
        return response;
    }
}

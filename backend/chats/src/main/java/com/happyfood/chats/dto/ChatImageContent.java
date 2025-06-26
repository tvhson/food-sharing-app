package com.happyfood.chats.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatImageContent {
    private String type; // "text" hoặc "image_url"
    private String text; // nếu là text
    private ImageUrl image_url; // nếu là image_url

    public static ChatImageContent text(String text) {
        return new ChatImageContent("text", text, null);
    }

    public static ChatImageContent image(String url) {
        return new ChatImageContent("image_url", null, new ImageUrl(url));
    }
}
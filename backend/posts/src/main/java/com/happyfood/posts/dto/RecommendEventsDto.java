package com.happyfood.posts.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RecommendEventsDto {
    List<EventsDto> ongoing;
    List<EventsDto> upcoming;
    List<EventsDto> all;
}

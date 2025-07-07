package com.happyfood.posts.service;

import com.happyfood.posts.dto.EventsDto;
import com.happyfood.posts.dto.RecommendEventsDto;

public interface IEventsService {
    EventsDto createEvent(Long userId, EventsDto eventsDto);
    EventsDto updateEvent(Long userId, Long eventId, EventsDto eventsDto);
    EventsDto getEventById(Long eventId);
    void deleteEvent(Long userId, Long eventId);

    RecommendEventsDto getRecommendedEvents(String longtitude, String Latitude, Long distance);
}

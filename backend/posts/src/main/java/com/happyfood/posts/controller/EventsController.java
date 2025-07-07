package com.happyfood.posts.controller;

import com.happyfood.posts.dto.EventsDto;
import com.happyfood.posts.dto.RecommendEventsDto;
import com.happyfood.posts.service.IEventsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/events")
public class EventsController {
    private final IEventsService eventsService;

    @GetMapping("/{eventId}")
    public ResponseEntity<EventsDto> getEventById(@PathVariable Long eventId) {
        EventsDto event = eventsService.getEventById(eventId);
        return ResponseEntity.ok(event);
    }

    @PostMapping("/create")
    public ResponseEntity<EventsDto> createEvent(@RequestHeader Long userId, @RequestBody EventsDto eventsDto) {
        EventsDto createdEvent = eventsService.createEvent(userId, eventsDto);
        return ResponseEntity.ok(createdEvent);
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventsDto> updateEvent(@RequestHeader Long userId, @PathVariable Long eventId, @RequestBody EventsDto eventsDto) {
        EventsDto updatedEvent = eventsService.updateEvent(userId, eventId, eventsDto);
        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@RequestHeader Long userId, @PathVariable Long eventId) {
        eventsService.deleteEvent(userId, eventId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/recommended")
    public ResponseEntity<RecommendEventsDto> getRecommendedEvents(
            @RequestParam String longitude,
            @RequestParam String latitude,
            @RequestParam(required = false) Long distance) {
        RecommendEventsDto recommendedEvents = eventsService.getRecommendedEvents(longitude, latitude, distance);
        return ResponseEntity.ok(recommendedEvents);
    }
}

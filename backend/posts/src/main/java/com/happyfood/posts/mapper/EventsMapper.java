package com.happyfood.posts.mapper;

import com.happyfood.posts.dto.EventsDto;
import com.happyfood.posts.entity.Events;

import java.util.Arrays;

public class EventsMapper {
    public static EventsDto mapToEventsDto(com.happyfood.posts.entity.Events events) {
        return EventsDto.builder()
                        .id(events.getId())
                        .title(events.getTitle())
                        .description(events.getDescription())
                        .imageUrl(events.getImageUrl())
                        .locationName(events.getLocationName())
                        .latitude(events.getLatitude())
                        .longitude(events.getLongitude())
                        .startDate(events.getStartDate())
                        .endDate(events.getEndDate())
                        .startTime(events.getStartTime())
                        .endTime(events.getEndTime())
                        .repeatDays(events.getRepeatDays() != null && !events.getRepeatDays().isEmpty()
                                    ? Arrays.stream(events.getRepeatDays().split("-"))
                                            .map(Integer::parseInt)
                                            .toList()
                                    : null)
                        .createdDate(events.getCreatedDate())
                        .build();
    }

    public static Events mapToEvents(EventsDto eventsDto) {
        return Events.builder()
                     .id(eventsDto.getId())
                     .title(eventsDto.getTitle())
                     .description(eventsDto.getDescription())
                     .imageUrl(eventsDto.getImageUrl())
                     .locationName(eventsDto.getLocationName())
                     .latitude(eventsDto.getLatitude())
                     .longitude(eventsDto.getLongitude())
                     .startDate(eventsDto.getStartDate())
                     .endDate(eventsDto.getEndDate())
                     .startTime(eventsDto.getStartTime())
                     .endTime(eventsDto.getEndTime())
                     .repeatDays(eventsDto.getRepeatDays() != null && !eventsDto.getRepeatDays().isEmpty() ? String.join("-", eventsDto.getRepeatDays().stream()
                                                                                                                                       .map(String::valueOf)
                                                                                                                                       .toList()) : null)
                     .createdDate(eventsDto.getCreatedDate())
                     .build();
    }
}

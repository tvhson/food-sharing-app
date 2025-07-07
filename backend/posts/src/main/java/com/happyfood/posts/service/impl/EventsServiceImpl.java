package com.happyfood.posts.service.impl;

import com.happyfood.posts.adapter.AccountsAdapter;
import com.happyfood.posts.dto.AccountsDto;
import com.happyfood.posts.dto.EventsDto;
import com.happyfood.posts.dto.RecommendEventsDto;
import com.happyfood.posts.entity.Events;
import com.happyfood.posts.exception.CustomException;
import com.happyfood.posts.mapper.EventsMapper;
import com.happyfood.posts.repository.EventsRepository;
import com.happyfood.posts.service.IEventsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EventsServiceImpl implements IEventsService {
    private static final double EARTH_RADIUS_KM = 6371.0;
    private final EventsRepository eventsRepository;
    private final AccountsAdapter accountsAdapter;

    @Override
    public EventsDto createEvent(Long userId, EventsDto eventsDto) {
        Events event = EventsMapper.mapToEvents(eventsDto);
        event.setAuthorId(userId);
        event.setCreatedDate(new Date());

        EventsDto eventsDto1 = EventsMapper.mapToEventsDto(eventsRepository.save(event));
        AccountsDto accountsDto = accountsAdapter.getAccount(userId);
        eventsDto1.setAuthor(accountsDto);

        return eventsDto1;
    }

    @Override
    public EventsDto updateEvent(Long userId, Long eventId, EventsDto eventsDto) {
        Events existingEvent = eventsRepository.findById(eventId)
                                               .orElseThrow(() -> new CustomException("Event not found with id: " + eventId, HttpStatus.NOT_FOUND));

        if (!existingEvent.getAuthorId().equals(userId)) {
            throw new CustomException("You are not authorized to update this event", HttpStatus.FORBIDDEN);
        }

        existingEvent.setTitle(eventsDto.getTitle());
        existingEvent.setDescription(eventsDto.getDescription());
        existingEvent.setImageUrl(eventsDto.getImageUrl());
        existingEvent.setLocationName(eventsDto.getLocationName());
        existingEvent.setLatitude(eventsDto.getLatitude());
        existingEvent.setLongitude(eventsDto.getLongitude());
        existingEvent.setStartDate(eventsDto.getStartDate());
        existingEvent.setEndDate(eventsDto.getEndDate());
        existingEvent.setStartTime(eventsDto.getStartTime());
        existingEvent.setEndTime(eventsDto.getEndTime());
        existingEvent.setRepeatDays(eventsDto.getRepeatDays() != null && !eventsDto.getRepeatDays().isEmpty()
                                    ? String.join("-", eventsDto.getRepeatDays().stream().map(String::valueOf).toList())
                                    : null);


        EventsDto eventsDto1 = EventsMapper.mapToEventsDto(eventsRepository.save(existingEvent));
        AccountsDto accountsDto = accountsAdapter.getAccount(userId);
        eventsDto1.setAuthor(accountsDto);
        return eventsDto1;
    }

    @Override
    public EventsDto getEventById(Long eventId) {
        Events event = eventsRepository.findById(eventId)
                                       .orElseThrow(() -> new CustomException("Event not found with id: " + eventId, HttpStatus.NOT_FOUND));

        EventsDto eventsDto1 = EventsMapper.mapToEventsDto(eventsRepository.save(event));
        AccountsDto accountsDto = accountsAdapter.getAccount(event.getAuthorId());
        eventsDto1.setAuthor(accountsDto);

        return eventsDto1;
    }

    @Override
    public void deleteEvent(Long userId, Long eventId) {
        Events existingEvent = eventsRepository.findById(eventId)
                                               .orElseThrow(() -> new CustomException("Event not found with id: " + eventId, HttpStatus.NOT_FOUND));
        if (!existingEvent.getAuthorId().equals(userId)) {
            throw new CustomException("You are not authorized to delete this event", HttpStatus.FORBIDDEN);
        }
        eventsRepository.delete(existingEvent);
    }

    @Override
    public RecommendEventsDto getRecommendedEvents(String longtitude, String latitude, Long distance) {
        if (distance == null) {
            return getDefaultRecommendedEvents(longtitude, latitude);
        }

        return getRecommendedAll(longtitude, latitude, distance);
    }

    private RecommendEventsDto getRecommendedAll(String longtitude, String latitude, Long distance) {
        List<EventsDto> all = new ArrayList<>();
        List<EventsDto> ongoing = new ArrayList<>();
        List<EventsDto> upcoming = new ArrayList<>();
        List<EventsDto> processedEvents = new ArrayList<>();

        List<Events> events = eventsRepository.findAll();
        if (events.isEmpty()) {
            return RecommendEventsDto.builder()
                                     .all(all)
                                     .ongoing(ongoing)
                                     .upcoming(upcoming)
                                     .build();
        }

        for (Events event : events) {
            EventsDto eventsDto = EventsMapper.mapToEventsDto(event);
            AccountsDto accounts = accountsAdapter.getAccount(event.getAuthorId());
            eventsDto.setAuthor(accounts);

            double postLatitude = Double.parseDouble(latitude);
            double postLongitude = Double.parseDouble(longtitude);
            double distanceKm = calculateDistanceKm(event.getLatitude(), event.getLongitude(), postLatitude, postLongitude);
            eventsDto.setDistance(distanceKm);
            if (distance != null && distanceKm > distance) {
                continue; // Skip events that are further than the specified distance
            }
            processedEvents.add(eventsDto);
        }

        // sort events by distance
        processedEvents.sort(Comparator.comparingDouble(EventsDto::getDistance));

        Date currentDate = new Date();
        int currentDayOfWeek = getVietnameseDayOfWeek(currentDate);

        for (EventsDto event : processedEvents) {
            if (event.getEndDate() == null) {
                // set end date 2027-01-01 if end date is null
                event.setEndDate(new Date(1704067200000L)); // 2027-01-01
            }

            if (event.getStartDate() != null) {
                if (event.getStartDate().before(currentDate) && event.getEndDate().after(currentDate)) {
                    event.setStatus("ONGOING");
                    all.add(event);
                    continue;
                }
                // nếu ngày bắt đầu sự kiện là ngày hôm nay, không phải là ngày mai
                if (event.getStartDate().after(currentDate)) {
                    event.setStatus("UPCOMING");
                    all.add(event);
                }
            } else {
                if (event.getRepeatDays().stream().anyMatch(day -> day == currentDayOfWeek)) {
                    // nếu ngày bắt đầu sự kiện là ngày hôm nay, không phải là ngày mai
                    Calendar start = Calendar.getInstance();
                    start.setTime(event.getStartTime());
                    Calendar end = Calendar.getInstance();
                    end.setTime(event.getEndTime());

                    Calendar now = Calendar.getInstance();
                    if (now.after(start) && now.before(end)) {
                        event.setStatus("ONGOING");
                        all.add(event);
                        continue;
                    }
                    if (now.before(start)) {
                        // nếu sự kiện chưa bắt đầu
                        event.setStatus("UPCOMING");
                        all.add(event);
                    }

                }
            }
        }

        return RecommendEventsDto.builder()
                                 .upcoming(upcoming)
                                 .ongoing(ongoing)
                                 .all(all)
                                 .build();
    }

    private RecommendEventsDto getDefaultRecommendedEvents(String longtitude, String latitude) {
        List<EventsDto> all = new ArrayList<>();
        List<EventsDto> ongoing = new ArrayList<>();
        List<EventsDto> upcoming = new ArrayList<>();
        List<EventsDto> processedEvents = new ArrayList<>();

        List<Events> events = eventsRepository.findAll();
        if (events.isEmpty()) {
            return RecommendEventsDto.builder()
                                     .all(all)
                                     .ongoing(ongoing)
                                     .upcoming(upcoming)
                                     .build();
        }

        for (Events event : events) {
            EventsDto eventsDto = EventsMapper.mapToEventsDto(event);
            AccountsDto accounts = accountsAdapter.getAccount(event.getAuthorId());
            eventsDto.setAuthor(accounts);

            double postLatitude = Double.parseDouble(latitude);
            double postLongitude = Double.parseDouble(longtitude);
            double distance = calculateDistanceKm(event.getLatitude(), event.getLongitude(), postLatitude, postLongitude);
            eventsDto.setDistance(distance);
            processedEvents.add(eventsDto);
        }
        // sort events by distance
        processedEvents.sort(Comparator.comparingDouble(EventsDto::getDistance));

        Date currentDate = new Date();
        int currentDayOfWeek = getVietnameseDayOfWeek(currentDate);

        for (EventsDto event : processedEvents) {
            if (event.getStartDate() != null) {

                if (event.getEndDate() == null) {
                    // set end date 2027-01-01 if end date is null
                    event.setEndDate(new Date(1704067200000L)); // 2027-01-01
                }

                if (event.getStartDate().before(currentDate) && event.getEndDate().after(currentDate)) {
                    event.setStatus("ONGOING");
                    ongoing.add(event);
                    continue;
                }
                // nếu ngày bắt đầu sự kiện là ngày hôm nay, không phải là ngày mai
                if (event.getStartDate().after(currentDate) && event.getStartDate().before(new Date(currentDate.getTime() + 24 * 60 * 60 * 1000))) {
                    event.setStatus("UPCOMING");
                    upcoming.add(event);
                }
            } else {
                if (event.getRepeatDays().stream().anyMatch(day -> day == currentDayOfWeek)) {
                    // nếu ngày bắt đầu sự kiện là ngày hôm nay, không phải là ngày mai
                    int x = compareCurrentTimeToRange(event.getStartTime(), event.getEndTime());
                    if (x == 0) {
                        event.setStatus("ONGOING");
                        ongoing.add(event);
                        continue;
                    }
                    if (x < 0) {
                        // nếu sự kiện chưa bắt đầu
                        event.setStatus("UPCOMING");
                        upcoming.add(event);
                    }

                }
            }
        }
        return RecommendEventsDto.builder()
                                 .all(all)
                                 .ongoing(ongoing)
                                 .upcoming(upcoming)
                                 .build();
    }

    public double calculateDistanceKm(double lat1, double lon1, double lat2, double lon2) {
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                   + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                     * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }

    public static int compareCurrentTimeToRange(Date startTime, Date endTime) {
        System.out.println("Start Time: " + startTime);
        System.out.println("End Time: " + endTime);
        Calendar now = Calendar.getInstance();
        System.out.println("Current Time: " + now.getTime());
        int nowInSeconds = toSeconds(now);

        Calendar start = Calendar.getInstance();
        start.setTime(startTime);
        int startInSeconds = toSeconds(start);

        Calendar end = Calendar.getInstance();
        end.setTime(endTime);
        int endInSeconds = toSeconds(end);

        if (nowInSeconds < startInSeconds) {
            return -1; // chưa tới
        } else if (nowInSeconds > endInSeconds) {
            return 1; // đã qua
        } else {
            return 0; // nằm trong khoảng
        }
    }

    private static int toSeconds(Calendar cal) {
        return cal.get(Calendar.HOUR_OF_DAY) * 3600 +
               cal.get(Calendar.MINUTE) * 60 +
               cal.get(Calendar.SECOND);
    }

    public static DayOfWeek getDayOfWeek(Date date) {
        LocalDate localDate = Instant.ofEpochMilli(date.getTime())
                                     .atZone(ZoneId.systemDefault())
                                     .toLocalDate();
        return localDate.getDayOfWeek(); // Trả về kiểu DayOfWeek: MONDAY, TUESDAY,...
    }

    public static int getVietnameseDayOfWeek(Date date) {
        DayOfWeek day = getDayOfWeek(date);
        return switch (day) {
            case MONDAY -> 2;
            case TUESDAY -> 3;
            case WEDNESDAY -> 4;
            case THURSDAY -> 5;
            case FRIDAY -> 6;
            case SATURDAY -> 7;
            case SUNDAY -> 8;
            default -> 1;
        };
    }
}

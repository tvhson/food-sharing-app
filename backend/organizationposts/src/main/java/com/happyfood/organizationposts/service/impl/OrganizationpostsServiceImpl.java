package com.happyfood.organizationposts.service.impl;

import com.happyfood.organizationposts.dto.AccountsDto;
import com.happyfood.organizationposts.dto.Coordinates;
import com.happyfood.organizationposts.dto.OrganizationpostsDetail;
import com.happyfood.organizationposts.dto.OrganizationpostsDto;
import com.happyfood.organizationposts.entity.AttendeeId;
import com.happyfood.organizationposts.entity.Organizationposts;
import com.happyfood.organizationposts.exception.CustomException;
import com.happyfood.organizationposts.mapper.OrganizationpostsMapper;
import com.happyfood.organizationposts.repository.OrganizationpostsRepository;
import com.happyfood.organizationposts.service.IOrganizationpostsService;
import com.happyfood.organizationposts.service.client.AccountsFeignClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizationpostsServiceImpl implements IOrganizationpostsService {
    private final OrganizationpostsRepository organizationpostsRepository;
    private final AccountsFeignClient accountsFeignClient;
    @Override
    public OrganizationpostsDetail getOrganizationpostsById(Long id) {
        OrganizationpostsDetail postsDetailDto = new OrganizationpostsDetail();

        Organizationposts organizationposts = organizationpostsRepository.findById(id).orElseThrow(() -> new CustomException("Organizationposts not found", HttpStatus.NOT_FOUND));
        OrganizationpostsDto organizationpostsDto = OrganizationpostsMapper.mapToOrganizationpostsDto(organizationposts);

        organizationpostsDto.setAttended(organizationposts.getAttendees().stream().anyMatch(attendee -> attendee.getUserId().equals(organizationposts.getUserId())));
        organizationpostsDto.setPeopleAttended(organizationposts.getAttendees().size());

        postsDetailDto.setOrganizationposts(organizationpostsDto);

        ResponseEntity<AccountsDto> accountsDtoResponseEntity = accountsFeignClient.getAccount(organizationposts.getUserId());

        if (accountsDtoResponseEntity != null && accountsDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
            postsDetailDto.setAccounts(accountsDtoResponseEntity.getBody());
        }

        return postsDetailDto;
    }

    @Override
    public List<OrganizationpostsDetail> getRecommendationOrganizationposts(Long userId) {
        List<OrganizationpostsDetail> organizationpostsList = new ArrayList<>();
        List<Organizationposts> organizationposts = organizationpostsRepository.findAll();

//        double latitude = Double.parseDouble(location.getLatitude());
//        double longitude = Double.parseDouble(location.getLongitude());


        for (Organizationposts organizationpost : organizationposts) {

            if (organizationpost.isDeleted()) continue;
//            if (organizationpost.getLatitude() == null || organizationpost.getLongitude() == null) continue;
            OrganizationpostsDto organizationpostsDto = OrganizationpostsMapper.mapToOrganizationpostsDto(organizationpost);
            organizationpostsDto.setAttended(organizationpost.getAttendees().stream().anyMatch(attendee -> attendee.getUserId().equals(userId)));
            organizationpostsDto.setPeopleAttended(organizationpost.getAttendees().size());
//            double postLatitude = Double.parseDouble(organizationpostsDto.getLatitude());
//            double postLongitude = Double.parseDouble(organizationpostsDto.getLongitude());
//            double distance = Math.sqrt(Math.pow(latitude - postLatitude, 2) + Math.pow(longitude - postLongitude, 2)) * 1.60934;
//            if (distance > 50) continue;
//            organizationpostsDto.setDistance(distance);

            OrganizationpostsDetail organizationpostsDetail = new OrganizationpostsDetail();
            organizationpostsDetail.setOrganizationposts(organizationpostsDto);
            ResponseEntity<AccountsDto> accountsDtoResponseEntity = accountsFeignClient.getAccount(organizationpost.getUserId());
            if (accountsDtoResponseEntity != null && accountsDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
                organizationpostsDetail.setAccounts(accountsDtoResponseEntity.getBody());
            }
            organizationpostsList.add(organizationpostsDetail);
        }
        Collections.reverse(organizationpostsList);
        return organizationpostsList;
    }

    @Override
    public List<OrganizationpostsDetail> getOrganizationpostsByUserId(Long userId) {
        List<Organizationposts> organizationposts = organizationpostsRepository.findByUserId(userId);
        Collections.reverse(organizationposts);
        return organizationposts.stream()
                .filter(organizationpost -> !organizationpost.isDeleted())
                .map(organizationpost -> {
                    OrganizationpostsDto organizationpostsDto = OrganizationpostsMapper.mapToOrganizationpostsDto(organizationpost);
                    organizationpostsDto.setAttended(organizationpost.getAttendees().stream().anyMatch(attendee -> attendee.getUserId().equals(userId)));
                    organizationpostsDto.setPeopleAttended(organizationpost.getAttendees().size());
                    OrganizationpostsDetail organizationpostsDetail = new OrganizationpostsDetail();
                    organizationpostsDetail.setOrganizationposts(organizationpostsDto);
                    ResponseEntity<AccountsDto> accountsDtoResponseEntity = accountsFeignClient.getAccount(organizationpost.getUserId());
                    if (accountsDtoResponseEntity != null && accountsDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
                        organizationpostsDetail.setAccounts(accountsDtoResponseEntity.getBody());
                    }
                    return organizationpostsDetail;
                })
                .toList();
    }

    @Override
    public OrganizationpostsDetail createOrganizationposts(Long userId, OrganizationpostsDto organizationpostsDto) {
        Organizationposts organizationPosts = OrganizationpostsMapper.mapToOrganizationposts(organizationpostsDto);
        organizationPosts.setUserId(userId);
        organizationPosts.setCreatedDate(new Date());
        organizationPosts.setAttendees(new ArrayList<>());

        OrganizationpostsDetail organizationpostsDetail = new OrganizationpostsDetail();
        organizationpostsDetail.setOrganizationposts(OrganizationpostsMapper.mapToOrganizationpostsDto(organizationpostsRepository.save(organizationPosts)));
        ResponseEntity<AccountsDto> accountsDtoResponseEntity = accountsFeignClient.getAccount(organizationPosts.getUserId());
        if (accountsDtoResponseEntity != null && accountsDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
            organizationpostsDetail.setAccounts(accountsDtoResponseEntity.getBody());
        }

        return organizationpostsDetail;
    }

    @Override
    public OrganizationpostsDetail updateOrganizationposts(Long id, Long userId, OrganizationpostsDto organizationpostsDto) {
        Organizationposts organizationposts = organizationpostsRepository.findById(id).orElseThrow(() -> new CustomException("Organizationposts not found", HttpStatus.NOT_FOUND));

        if (!organizationposts.getUserId().equals(userId)) {
            throw new CustomException("You are not authorized to update this post", HttpStatus.UNAUTHORIZED);
        }

        organizationposts.setTitle(organizationpostsDto.getTitle());
        organizationposts.setDescription(organizationpostsDto.getDescription());
        organizationposts.setImageUrl(organizationpostsDto.getImageUrl());
        organizationposts.setLinkWebsites(organizationpostsDto.getLinkWebsites());
        organizationposts.setLocationName(organizationpostsDto.getLocationName());
        organizationposts.setLatitude(organizationpostsDto.getLatitude());
        organizationposts.setLongitude(organizationpostsDto.getLongitude());

        OrganizationpostsDto organizationpostsDto1 = OrganizationpostsMapper.mapToOrganizationpostsDto(organizationpostsRepository.save(organizationposts));
        organizationpostsDto1.setAttended(organizationposts.getAttendees().stream().anyMatch(attendee -> attendee.getUserId().equals(userId)));
        organizationpostsDto1.setPeopleAttended(organizationposts.getAttendees().size());

        OrganizationpostsDetail organizationpostsDetail = new OrganizationpostsDetail();
        organizationpostsDetail.setOrganizationposts(organizationpostsDto1);
        ResponseEntity<AccountsDto> accountsDtoResponseEntity = accountsFeignClient.getAccount(organizationposts.getUserId());
        if (accountsDtoResponseEntity != null && accountsDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
            organizationpostsDetail.setAccounts(accountsDtoResponseEntity.getBody());
        }

        return organizationpostsDetail;
    }

    @Override
    public OrganizationpostsDetail toggleAttendOrganizationposts(Long id, Long userId) {
        Organizationposts organizationposts = organizationpostsRepository.findById(id).orElseThrow(() -> new CustomException("Organizationposts not found", HttpStatus.NOT_FOUND));

        if (organizationposts.getAttendees().stream().anyMatch(attendee -> attendee.getUserId().equals(userId))) {
            organizationposts.getAttendees().removeIf(attendee -> attendee.getUserId().equals(userId));
        } else {
            organizationposts.getAttendees().add(AttendeeId.builder().userId(userId).organizationPost(organizationposts).build());
        }

        organizationpostsRepository.save(organizationposts);

        OrganizationpostsDto organizationpostsDto = OrganizationpostsMapper.mapToOrganizationpostsDto(organizationpostsRepository.save(organizationposts));
        organizationpostsDto.setAttended(organizationposts.getAttendees().stream().anyMatch(attendee -> attendee.getUserId().equals(userId)));
        organizationpostsDto.setPeopleAttended(organizationposts.getAttendees().size());

        OrganizationpostsDetail organizationpostsDetail = new OrganizationpostsDetail();
        organizationpostsDetail.setOrganizationposts(organizationpostsDto);
        ResponseEntity<AccountsDto> accountsDtoResponseEntity = accountsFeignClient.getAccount(organizationposts.getUserId());
        if (accountsDtoResponseEntity != null && accountsDtoResponseEntity.getStatusCode().is2xxSuccessful()) {
            organizationpostsDetail.setAccounts(accountsDtoResponseEntity.getBody());
        }

        return organizationpostsDetail;
    }

    @Override
    public void deleteOrganizationposts(Long id, Long userId) {
        Organizationposts organizationposts = organizationpostsRepository.findById(id).orElseThrow(() -> new CustomException("Organizationposts not found", HttpStatus.NOT_FOUND));

        if (!organizationposts.getUserId().equals(userId)) {
            throw new CustomException("You are not authorized to delete this post", HttpStatus.UNAUTHORIZED);
        }

        organizationposts.setDeleted(true);
        organizationpostsRepository.save(organizationposts);
    }
}

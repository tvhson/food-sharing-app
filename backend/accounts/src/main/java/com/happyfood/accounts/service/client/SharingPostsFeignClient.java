package com.happyfood.accounts.service.client;


import com.happyfood.accounts.dto.SharingPostsDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "sharingposts", url = "http://shanringposts:8090", fallback = SharingPostsFallback.class)
public interface SharingPostsFeignClient {
    @GetMapping(value = "/sharingposts", consumes = "application/json")
    public ResponseEntity<List<SharingPostsDto>> getAll();

    @GetMapping(value = "/sharingposts/{id}", consumes = "application/json")
    public ResponseEntity<SharingPostsDto> get(@PathVariable Long id);
}

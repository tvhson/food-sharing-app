package com.happyfood.accounts.service.client;

import com.happyfood.accounts.dto.SharingPostsDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class SharingPostsFallback implements SharingPostsFeignClient {
    @Override
    public ResponseEntity<List<SharingPostsDto>> getAll() {
        System.out.println("fallback");
        return null;
    }

    @Override
    public ResponseEntity<SharingPostsDto> get(Long id) {
        System.out.println("fallback");
        return null;
    }
}

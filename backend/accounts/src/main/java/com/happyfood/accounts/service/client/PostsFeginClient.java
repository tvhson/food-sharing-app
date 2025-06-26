package com.happyfood.accounts.service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "posts", url = "http://posts:8090")
public interface PostsFeginClient {
    @DeleteMapping("/posts/delete-user/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId);

    @DeleteMapping("/groups/delete-user/{userId}")
    public ResponseEntity<?> deleteUserGr(@PathVariable Long userId);
}

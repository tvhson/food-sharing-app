package com.happyfood.accounts.controller;

import com.happyfood.accounts.service.IMediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
public class MediaController {
    private final IMediaService mediaService;
    @PostMapping
    public ResponseEntity<List<String>> uploadFile(@RequestParam(value="file") MultipartFile[] file) {
        List <String> fileNames = new ArrayList<>();
        Arrays.asList(file).forEach(f -> {
            fileNames.add(mediaService.uploadFile(f));
        });
        return new ResponseEntity<>(fileNames, HttpStatus.OK);
    }
    @GetMapping("/{fileName}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileName){
        byte[] data = mediaService.downloadFile(fileName);
        ByteArrayResource resource = new ByteArrayResource(data);
        return ResponseEntity
                .ok()
                .contentLength(data.length)
                .header("Content-type","application/octet-stream")
                .header("Content-disposition","attachment; filename=\""+fileName+"\"")
                .body(resource);
    }
    @DeleteMapping("/{fileName}")
    public ResponseEntity<String> deleteFile(@PathVariable String fileName){
        return new ResponseEntity<>(mediaService.deleteFile(fileName), HttpStatus.OK);
    }
}
package com.happyfood.accounts.service;

import org.springframework.web.multipart.MultipartFile;

public interface IMediaService {
    String uploadFile(MultipartFile file);
    byte[] downloadFile(String fileName);
    String deleteFile(String fileName);
}
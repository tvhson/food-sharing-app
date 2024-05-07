package com.happyfood.media.service.impl;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.amazonaws.util.IOUtils;
import com.happyfood.media.service.IMediaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@Service
@Slf4j
public class MediaServiceImpl implements IMediaService {
    @Autowired
    private AmazonS3 s3;
    @Value("${aws.s3.bucket}")
    private String bucketName;

    @Override
    public String uploadFile(MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return null;
            }
            File fileObj = convertMultiPartToFile(file);
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            s3.putObject(new PutObjectRequest(bucketName, fileName, fileObj));
            fileObj.delete();
            return "https://"+bucketName+".s3.amazonaws.com/"+fileName;
        } catch (Exception e){
            return null;
        }
    }

    @Override
    public byte[] downloadFile(String fileName) {
        S3Object s3Object = s3.getObject(bucketName,fileName);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        try{
            byte[] content = IOUtils.toByteArray(inputStream);
            return content;
        }catch (IOException e){
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public String deleteFile(String fileName) {
        s3.deleteObject(bucketName,fileName);
        return fileName+" removed ...";
    }

    private File convertMultiPartToFile(MultipartFile file){
        File convertedFile = new File(file.getOriginalFilename());
        try{
            FileOutputStream fos = new FileOutputStream(convertedFile);
            fos.write(file.getBytes());
            fos.close();
        }catch (IOException e){
            log.error("Error converting multipartFile to file",e);
        }
        return convertedFile;
    }
}

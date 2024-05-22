package com.happyfood.posts.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
@Builder
public class AccountsDto {
    private Long id;
    private String name;
    private String imageUrl;
    private String locationName;
    private String latitude;
    private String longitude;
}

package com.happyfood.organizationposts.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NonNull
@Builder
public class Coordinates {
    private String latitude;
    private String longitude;
}

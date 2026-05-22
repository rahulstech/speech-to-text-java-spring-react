package com.github.rahulstech.stt.dto;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;

public record GenerateTextRequest(
        @NotBlank(message = "blank audio url")
        @URL(protocol = "https", host = "firebasestorage.googleapis.com", message = "unaccepted audio url")
        String audioUrl,

        String lang
) {
}

package com.github.rahulstech.stt.dto;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;

public record GenerateTextRequest(
        @NotBlank(message = "blank audio url")
        // TODO: uncomment audioUrl validation rule
        //@URL(protocol = "https", host = "firebasestorage.googleapis.com", message = "unsupported audio url")
        String audioUrl,
        String lang
) {
}

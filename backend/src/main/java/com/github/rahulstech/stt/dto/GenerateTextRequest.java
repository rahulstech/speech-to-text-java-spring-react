package com.github.rahulstech.stt.dto;

import jakarta.validation.constraints.NotBlank;

public record GenerateTextRequest(
        @NotBlank(message = "blank audio url")
        String audioUrl,
        String lang
) {}

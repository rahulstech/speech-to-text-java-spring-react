package com.github.rahulstech.stt.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank(message = "email is required")
        @Email(message = "invalid email")
        @Size(max = 300, message = "email exceeds 300 characters")
        String email,
        @NotBlank(message = "password is required")
        @Size(min = 6, max = 16, message = "password must be between 6 and 16 characters")
        String password,
        @NotBlank(message = "name is required")
        @Size(max = 100, message = "name exceeds 100 characters")
        String name
) {}

package com.github.rahulstech.stt.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LogInRequest(
        @NotBlank(message = "email is required")
        @Email(message = "invalid email")
        @Size(max = 300, message = "email exceeds 300 characters")
        String email,
        @NotBlank(message = "password is required")
        @Size(min = 6, max = 16, message = "password must be between 6 and 16 characters")
        String password
) {}

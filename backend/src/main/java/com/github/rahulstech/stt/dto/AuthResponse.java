package com.github.rahulstech.stt.dto;

public record AuthResponse(
        TokenResponse tokens,
        UserResponse user
) {}

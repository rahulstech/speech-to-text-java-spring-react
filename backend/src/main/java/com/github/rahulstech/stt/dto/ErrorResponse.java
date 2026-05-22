package com.github.rahulstech.stt.dto;

import java.util.List;

public record ErrorResponse(
        Integer code,
        List<String> errors
) {
}

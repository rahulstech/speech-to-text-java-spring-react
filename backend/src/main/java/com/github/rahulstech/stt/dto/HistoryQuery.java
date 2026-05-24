package com.github.rahulstech.stt.dto;

import jakarta.validation.constraints.*;

public record HistoryQuery(
        Long after,
        Long before,
        @Min(value = 1, message = "first should be at least 1")
        @Max(value = 20, message = "first should be at most 20")
        Integer first
) {

    @AssertTrue(message = "use either after or before or none")
    public boolean isValidCursor() {
        return (after == null && before == null) || (after != null ^ before != null);
    }

    public boolean isBefore() {
        return before != null;
    }

    public boolean isAfter() {
        return after != null;
    }
}

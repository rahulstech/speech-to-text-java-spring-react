package com.github.rahulstech.stt.dto;

import java.util.List;

public record HistoryResponse(
        Long cursorBefore,
        Long cursorAfter,
        int size,
        List<TranscriptionResponse> histories
) {}
package com.github.rahulstech.stt.dto;

import com.github.rahulstech.stt.model.Transcription;

import java.util.List;

public record HistoryResponse(
        Long cursorBefore,
        Long cursorAfter,
        int size,
        List<TranscriptionResponse> histories
) {
}

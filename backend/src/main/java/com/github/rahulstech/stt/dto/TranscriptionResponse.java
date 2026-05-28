package com.github.rahulstech.stt.dto;

import com.github.rahulstech.stt.model.Transcription;

import java.time.OffsetDateTime;

public record TranscriptionResponse(
        Long id,
        String audioFile,
        String transcript,
        OffsetDateTime createdAt
) {

    public static TranscriptionResponse from(Transcription t) {
        return new TranscriptionResponse(
                t.getId(),
                t.getAudioFile(),
                t.getTranscript(),
                t.getCreatedAt()
        );
    }
}

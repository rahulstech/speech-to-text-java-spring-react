package com.github.rahulstech.stt.service;

import com.github.rahulstech.stt.dto.STTResponse;

import java.util.concurrent.CompletableFuture;

public interface SpeechToTextService {

    /**
     *
     * @param audioUrl the storage url pointing to the audio binary
     * @param language language of the audio. set null to auto-detect
     * @return ComputableFuture that run the speech to text request
     */
    CompletableFuture<STTResponse> transcribeAudio(String audioUrl, String language);
}

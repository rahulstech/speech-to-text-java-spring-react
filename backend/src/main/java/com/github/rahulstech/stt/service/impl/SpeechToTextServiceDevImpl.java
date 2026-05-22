package com.github.rahulstech.stt.service.impl;

import com.github.rahulstech.stt.dto.STTResponse;
import com.github.rahulstech.stt.service.SpeechToTextService;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

@Service
@Profile("dev")
public class SpeechToTextServiceDevImpl implements SpeechToTextService {

    private final Executor executor = Executors.newSingleThreadExecutor();

    @Override
    public CompletableFuture<STTResponse> transcribeAudio(String audioUrl, String language) {

        return CompletableFuture
                .supplyAsync(()-> {
                    try {
                        Thread.sleep(3000);
                        return new STTResponse(audioUrl, "This is a fake transcription.");
                    } catch (Exception e) {
                        throw new RuntimeException(e);
                    }
                });
    }
}

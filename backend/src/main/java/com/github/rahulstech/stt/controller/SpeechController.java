package com.github.rahulstech.stt.controller;

import com.github.rahulstech.stt.dto.GenerateTextRequest;
import com.github.rahulstech.stt.dto.HistoryQuery;
import com.github.rahulstech.stt.dto.HistoryResponse;
import com.github.rahulstech.stt.model.Transcription;
import com.github.rahulstech.stt.service.SpeechToTextService;
import com.github.rahulstech.stt.service.TranscriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/speech")
@CrossOrigin("*")
public class SpeechController {

    @Autowired
    private TranscriptionService transcriptionService;

    @Autowired
    private SpeechToTextService sttService;

    @PostMapping()
    public Transcription generateTranscript(@Valid @RequestBody GenerateTextRequest body){
        var future = sttService.transcribeAudio(body.audioUrl(), body.lang());
        future.join();

        var response = future.resultNow();

        var transcription = new Transcription();
        transcription.setAudioFile(response.audioUrl());
        transcription.setTranscript(response.transcript());

        return transcriptionService.createTranscription(transcription);
    }

    @GetMapping("/{id}")
    public Transcription getTranscription(@PathVariable Long id){
        return transcriptionService.getTranscriptionById(id);
    }

    @GetMapping("/history")
    public HistoryResponse getHistory(
            @Valid HistoryQuery query
    ) {
        return transcriptionService.getTranscriptions(query);
    }
}

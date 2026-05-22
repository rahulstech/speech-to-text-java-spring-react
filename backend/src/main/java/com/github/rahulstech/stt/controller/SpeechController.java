package com.github.rahulstech.stt.controller;

import com.github.rahulstech.stt.model.Transcription;
import com.github.rahulstech.stt.service.TranscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/speech")
public class SpeechController {

    @Autowired
    private TranscriptionService service;

    @PostMapping()
    public Transcription addTranscription(@RequestBody Transcription transcription){
        return service.createTranscription(transcription);
    }

    @GetMapping("/{id}")
    public Transcription getTranscription(@PathVariable Long id){
        return service.getTranscriptionById(id);
    }

    @GetMapping("/history")
    public List<Transcription> getHistory(
            @RequestParam(name = "page", defaultValue = "1") int pageNumber,
            @RequestParam(name = "size", defaultValue = "20") int pageSize
    ) {
        return service.getTranscriptions(pageNumber, pageSize);
    }
}

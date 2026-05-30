package com.github.rahulstech.stt.controller;

import com.github.rahulstech.stt.dto.GenerateTextRequest;
import com.github.rahulstech.stt.dto.HistoryQuery;
import com.github.rahulstech.stt.dto.HistoryResponse;
import com.github.rahulstech.stt.dto.TranscriptionResponse;
import com.github.rahulstech.stt.error.HttpException;
import com.github.rahulstech.stt.model.Transcription;
import com.github.rahulstech.stt.model.User;
import com.github.rahulstech.stt.service.SpeechToTextService;
import com.github.rahulstech.stt.service.TranscriptionService;
import com.github.rahulstech.stt.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/speech")
//@CrossOrigin("*") // SecurityConfiguration adds cors configuration, not explicitly required here
public class SpeechController {

    private final UserService userService;

    private final TranscriptionService transcriptionService;

    private final SpeechToTextService sttService;


    public SpeechController(
        UserService userService,
        TranscriptionService transcriptionService,
        SpeechToTextService sttService
    ) {
        this.userService = userService;
        this.transcriptionService = transcriptionService;
        this.sttService = sttService;
    }

    @PostMapping()
    public TranscriptionResponse generateTranscript(
            Authentication auth,
            @Valid @RequestBody GenerateTextRequest body
    ){
        var future = sttService.transcribeAudio(body.audioUrl(), body.lang());
        future.join();

        var response = future.resultNow();
        var authUser = getAuthUser(auth);
        var transcription = new Transcription(response.audioUrl(), response.transcript(), authUser);

        return TranscriptionResponse.from(transcriptionService.createTranscription(transcription));
    }

    @GetMapping("/{id}")
    public Transcription getTranscription(@PathVariable Long id){
        return transcriptionService.getTranscriptionById(id);
    }

    @GetMapping("/history")
    public HistoryResponse getHistory(
            Authentication auth,
            @Valid HistoryQuery query
    ) {
        var authUser = getAuthUser(auth);
        return transcriptionService.getTranscriptionsOfUser(authUser.getId(), query);
    }

    private User getAuthUser(Authentication auth) {
        try {
            var userId = Long.valueOf(auth.getName());
            return userService.getUserById(userId);
        }
        catch (Exception ex) {
            throw HttpException.forbidden("login required");
        }
    }
}

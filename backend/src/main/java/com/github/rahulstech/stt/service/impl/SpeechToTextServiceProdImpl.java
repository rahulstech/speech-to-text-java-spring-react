package com.github.rahulstech.stt.service.impl;

import com.deepgram.AsyncDeepgramClient;
import com.deepgram.resources.listen.v1.media.requests.ListenV1RequestUrl;
import com.deepgram.resources.listen.v1.media.types.MediaTranscribeRequestModel;
import com.deepgram.resources.listen.v1.media.types.MediaTranscribeResponse;
import com.deepgram.types.ListenV1AcceptedResponse;
import com.deepgram.types.ListenV1Response;
import com.github.rahulstech.stt.dto.STTResponse;
import com.github.rahulstech.stt.service.SpeechToTextService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@Profile("prod")
public class SpeechToTextServiceProdImpl implements SpeechToTextService {

    private static final int TIMEOUT_SECONDS = 5;

    private static final int MAX_RETRIES = 3;

    private final AsyncDeepgramClient client;

    public SpeechToTextServiceProdImpl(
            @Value("${DEEPGRAM_API_KEY}") String apiKey
    ) {
        client = AsyncDeepgramClient.builder()
                .apiKey(apiKey)
                .maxRetries(MAX_RETRIES)
                .timeout(TIMEOUT_SECONDS)
                .build();
    }

    @Override
    public CompletableFuture<STTResponse> transcribeAudio(String audioUrl, String language) {

        var urlBuilder = ListenV1RequestUrl.builder().url(audioUrl)
                .punctuate(true)
                .model(MediaTranscribeRequestModel.NOVA3);

        if (language == null) {
            urlBuilder.detectLanguage(true);
        }
        else {
            urlBuilder.language(language);
        }

        var url =  urlBuilder.build();

        return client.listen().v1().media().transcribeUrl(url)
                .thenApply(response -> {
                    var transcribe = extractTranscribeFromResponse(response);
                    return new STTResponse(audioUrl, transcribe);
                });
    }
    
    private String extractTranscribeFromResponse(MediaTranscribeResponse response) {
        return response.visit(new MediaTranscribeResponse.Visitor<>() {
            @Override
            public String visit(ListenV1Response value) {
                var channels = value.getResults().getChannels();
                if (channels.isEmpty()) {
                    return "";
                }
                var alternatives = channels.getFirst().getAlternatives();
                if (alternatives.isEmpty() ||  alternatives.get().isEmpty()) {
                    return "";
                }
                return alternatives.get().getFirst().getTranscript().orElse("");
            }

            @Override
            public String visit(ListenV1AcceptedResponse value) {
                /* required for conversational audio */
                return "";
            }
        });
    }
}

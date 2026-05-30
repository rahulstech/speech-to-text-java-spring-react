package com.github.rahulstech.stt.service;

import com.github.rahulstech.stt.dto.HistoryQuery;
import com.github.rahulstech.stt.dto.HistoryResponse;
import com.github.rahulstech.stt.dto.TranscriptionResponse;
import com.github.rahulstech.stt.model.Transcription;
import com.github.rahulstech.stt.repository.TranscriptionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TranscriptionService {

    public static final int MAX_PAGE_SIZE = 20;

    private final TranscriptionRepository repo;

    public TranscriptionService(TranscriptionRepository repo) {
        this.repo = repo;
    }

    public Transcription createTranscription(Transcription transcription){
        return repo.save(transcription);
    }

    public Transcription getTranscriptionById( Long id){
        return repo.findById(id).orElse(null);
    }

    public HistoryResponse getTranscriptionsOfUser(Long userId, HistoryQuery query) {
        var pageable = getHistoryPageRequest(query.first());
        List<Transcription> histories;
        Long cursor;
        if (query.isBefore()) {
            histories = repo.findByUser_IdAndIdGreaterThanEqual(userId, query.before(),pageable);
            cursor = query.before();
        }
        else if (query.isAfter()) {
            histories = repo.findByUser_IdAndIdLessThanEqual(userId, query.after(), pageable);
            cursor = query.after();
        }
        else {
            histories = repo.findByUser_Id(userId, pageable);
            cursor = null;
        }

        Long cursorBefore, cursorAfter;
        if (!histories.isEmpty()) {
            cursorBefore = histories.getFirst().getId() + 1;
            cursorAfter = histories.getLast().getId() - 1;
        }
        else if (cursor != null) {
            cursorBefore = cursor + 1;
            cursorAfter = cursor - 1;
        }
        else {
            cursorBefore = null;
            cursorAfter = null;
        }

        return new HistoryResponse(
                cursorBefore,
                cursorAfter,
                query.first(),
                histories.stream().map(TranscriptionResponse::from).toList()
        );
    }

    private PageRequest getHistoryPageRequest(int limit) {
        return PageRequest.of(0,
                Math.min(limit, MAX_PAGE_SIZE),
                Sort.by(Sort.Direction.DESC, "createdAt", "id")
        );
    }
}

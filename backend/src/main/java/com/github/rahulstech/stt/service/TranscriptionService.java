package com.github.rahulstech.stt.service;

import com.github.rahulstech.stt.dto.HistoryQuery;
import com.github.rahulstech.stt.dto.HistoryResponse;
import com.github.rahulstech.stt.model.Transcription;
import com.github.rahulstech.stt.repository.TranscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TranscriptionService {

    public static final int MAX_PAGE_SIZE = 20;

    @Autowired
    private TranscriptionRepository repo;

    public Transcription createTranscription(Transcription transcription){
        return repo.save(transcription);
    }

    public Transcription getTranscriptionById( Long id){
        return repo.findById(id).orElse(null);
    }

    public HistoryResponse getTranscriptions(HistoryQuery query) {
        var pageable = getHistoryPageRequest(query.first());
        List<Transcription> histories;
        Long cursor;
        if (query.isBefore()) {
            histories = repo.findByIdGreaterThanEqual(query.before(),pageable);
            cursor = query.before();
        }
        else if (query.isAfter()) {
            histories = repo.findByIdLessThanEqual(query.after(), pageable);
            cursor = query.after();
        }
        else {
            histories = repo.findAll(pageable).toList();
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
                histories
        );
    }

    private PageRequest getHistoryPageRequest(int limit) {
        return PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt", "id"));
    }
}

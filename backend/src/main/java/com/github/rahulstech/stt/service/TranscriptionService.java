package com.github.rahulstech.stt.service;

import com.github.rahulstech.stt.model.Transcription;
import com.github.rahulstech.stt.repository.TranscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TranscriptionService {

    private static final int MAX_PAGE_SIZE = 20;

    @Autowired
    private TranscriptionRepository repo;

    public Transcription createTranscription(Transcription transcription){
        return repo.save(transcription);
    }

    public Transcription getTranscriptionById( Long id){
        return repo.findById(id).orElse(null);
    }

    public List<Transcription> getTranscriptions(int page, int size) {
        var pageNumber = Math.max(0, page-1);
        var pageSize = Math.min(MAX_PAGE_SIZE, size);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());
        var result = repo.findAll(pageable);
        return result.toList();
    }
}

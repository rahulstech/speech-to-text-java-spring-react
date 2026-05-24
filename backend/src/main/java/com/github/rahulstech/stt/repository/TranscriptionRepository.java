package com.github.rahulstech.stt.repository;

import com.github.rahulstech.stt.model.Transcription;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TranscriptionRepository
        extends JpaRepository<Transcription, Long> {

    List<Transcription> findByIdGreaterThanEqual(
            Long id,
            Pageable pageable
    );

    List<Transcription> findByIdLessThanEqual(
            Long id,
            Pageable pageable
    );
}

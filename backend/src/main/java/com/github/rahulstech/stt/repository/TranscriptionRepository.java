package com.github.rahulstech.stt.repository;

import com.github.rahulstech.stt.model.Transcription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TranscriptionRepository extends JpaRepository<Transcription,Long> {
}

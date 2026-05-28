package com.github.rahulstech.stt.repository;

import com.github.rahulstech.stt.model.Transcription;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TranscriptionRepository
        extends JpaRepository<Transcription, Long> {
    /**
     * query method name strictly following the column names.
     * for example: {@link Transcription} has user_id column
     * therefore method name is
     * findByUser_IdAndIdGreaterThanEqual (the underscore required)
     * not
     * findByUserIdAndIdGreaterThanEqual
     */

    List<Transcription> findByUser_IdAndIdGreaterThanEqual(
            Long userId,
            Long id,
            Pageable pageable
    );

    List<Transcription> findByUser_IdAndIdLessThanEqual(
            Long userId,
            Long id,
            Pageable pageable
    );

    List<Transcription> findByUser_Id(
            Long userId,
            Pageable pageable
    );
}

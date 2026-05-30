package com.github.rahulstech.stt.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "transcriptions")
public class Transcription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "audio_file", nullable = false)
    private String audioFile;

    @Column(name = "transcript")
    private String transcript;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @ManyToOne(
            fetch = FetchType.LAZY
            , optional = false
            // JPA cascade and sql cascade are different.
            // also JPA cascade required relation from User to Transcription entity.
            // that's what db level on delete cascade is safer in this case
            // ,  cascade = CascadeType.REMOVE
    )
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    protected Transcription() {
        // required by JPA
    }

    public Transcription(String audioFile, String transcript, User user) {
        this.audioFile = audioFile;
        this.transcript = transcript;
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public String getAudioFile() {
        return audioFile;
    }

    public String getTranscript() {
        return transcript;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public User getUser() {
        return user;
    }
}
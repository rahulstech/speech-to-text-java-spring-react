package com.github.rahulstech.stt.error;

import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.List;

public class HttpException extends RuntimeException {

    public final HttpStatus status;
    public final List<String> messages;

    public HttpException(HttpStatus status) {
        this(status, List.of(status.getReasonPhrase()), null);
    }

    public HttpException(HttpStatus status, String message) {
        this(status, List.of(message), null);
    }

    public HttpException(HttpStatus status, String message, Exception reason) {
        this(status, List.of(message), reason);
    }

    public HttpException(HttpStatus status, List<String> messages) {
        this(status, messages, null);
    }

    public HttpException(HttpStatus status, List<String> messages, Exception reason) {
        super(reason);
        this.status = status;
        this.messages = Collections.unmodifiableList(messages);
    }
}

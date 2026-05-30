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

    public HttpException(HttpStatus status, List<String> messages, Exception reason) {
        super(reason);
        this.status = status;
        this.messages = Collections.unmodifiableList(messages);
    }


    // Http 4xx

    public static HttpException unauthorized(String message) {
        return new HttpException(HttpStatus.UNAUTHORIZED, message);
    }

    public static HttpException conflict(String message) {
        return new HttpException(HttpStatus.CONFLICT, message);
    }

    public static HttpException notFound(String message) {
        return new HttpException(HttpStatus.NOT_FOUND, message);
    }

    public static HttpException forbidden(String message) {
        return new HttpException(HttpStatus.FORBIDDEN, message);
    }

    // Http 5xx

    public static HttpException internalError() {
        return new HttpException(HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

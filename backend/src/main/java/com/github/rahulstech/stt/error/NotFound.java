package com.github.rahulstech.stt.error;

import org.springframework.http.HttpStatus;

public class NotFound extends HttpException {

    public NotFound(String message) {
        super(HttpStatus.NOT_FOUND, message);
    }
}

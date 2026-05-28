package com.github.rahulstech.stt.error;

import org.springframework.http.HttpStatus;

public class Conflict extends HttpException {

    public Conflict(String message) {
        super(HttpStatus.CONFLICT, message);
    }
}

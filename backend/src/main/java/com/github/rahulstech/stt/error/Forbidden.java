package com.github.rahulstech.stt.error;

import org.springframework.http.HttpStatus;

public class Forbidden extends HttpException {

    public Forbidden(String message) {
        super(HttpStatus.FORBIDDEN, message);
    }
}

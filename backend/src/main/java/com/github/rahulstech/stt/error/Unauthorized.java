package com.github.rahulstech.stt.error;

import org.springframework.http.HttpStatus;

public class Unauthorized extends HttpException {

    public Unauthorized(String message) {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}

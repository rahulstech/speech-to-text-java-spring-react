package com.github.rahulstech.stt.controller;

import com.github.rahulstech.stt.dto.*;
import com.github.rahulstech.stt.model.User;
import com.github.rahulstech.stt.service.JWTService;
import com.github.rahulstech.stt.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin("*") // SecurityConfiguration adds cors configuration, not explicitly required here
public class AuthController {

    private final UserService userService;
    private final JWTService jwtService;

    public AuthController(UserService service, JWTService jwtService) {
        this.userService = service;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        var user = userService.createUser(req);
        return createAuthResponse(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LogInRequest req) {
        var user = userService.tryLogInOrThrow(req);
        return createAuthResponse(user);
    }

    private AuthResponse createAuthResponse(User user) {
        var accessToken = jwtService.generateAccessToken(user);
        var tokenResponse = new TokenResponse(accessToken);
        var userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail());
        return new AuthResponse(tokenResponse, userResponse);
    }
}

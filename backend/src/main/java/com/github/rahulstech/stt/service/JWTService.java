package com.github.rahulstech.stt.service;

import com.github.rahulstech.stt.model.User;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JWTService {

    private static final long ACCESS_TOKEN_EXPIRY_SECONDS = 3600 * 24; // 1 day

    private final JwtEncoder jwtEncoder;

    public JWTService(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String generateAccessToken(User user) {
        Instant issueAt = Instant.now();
        Instant expireAt = issueAt.plusSeconds(ACCESS_TOKEN_EXPIRY_SECONDS);
        var claims = JwtClaimsSet.builder()
                .subject(user.getId().toString())
                .issuedAt(issueAt)
                .expiresAt(expireAt)
                .claim("email", user.getEmail())
                .build();
        return jwtEncoder
                .encode(JwtEncoderParameters.from(claims))
                .getTokenValue();
    }
}

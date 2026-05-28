package com.github.rahulstech.stt.service;

import com.github.rahulstech.stt.dto.LogInRequest;
import com.github.rahulstech.stt.dto.RegisterRequest;
import com.github.rahulstech.stt.error.Conflict;
import com.github.rahulstech.stt.error.NotFound;
import com.github.rahulstech.stt.error.Unauthorized;
import com.github.rahulstech.stt.model.User;
import com.github.rahulstech.stt.repository.UserRepository;
import jakarta.persistence.EntityManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private UserRepository userRepo;

    private PasswordEncoder passwordEncoder;

    private EntityManager entityManager;

    public UserService(UserRepository userRepo, PasswordEncoder passwordEncoder, EntityManager entityManager) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.entityManager = entityManager;
    }

    public User createUser(RegisterRequest req) {
        try {
            var passwordHash = passwordEncoder.encode(req.password());
            var user = new User(req.name(), req.email(), passwordHash);
            return userRepo.saveAndFlush(user);
        } catch (Exception e) {
            // TODO: log the error
            throw new Conflict("invalid email"); // throw if unique constraint fails
        }
    }

    public User tryLogInOrThrow(LogInRequest req) {
        var user = userRepo.findUserByEmail(req.email()).orElse(null);
        if (user == null) {
            throw new NotFound("user not found");
        }
        var passwordMatched = passwordEncoder.matches(req.password(), user.getPasswordHash());
        if (!passwordMatched) {
            throw new Unauthorized("incorrect password");
        }
        return user;
    }

    public User getUserById(Long userId) {
        return entityManager.getReference(User.class, userId);
    }
}

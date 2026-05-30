package com.github.rahulstech.stt.service;

import com.github.rahulstech.stt.dto.LogInRequest;
import com.github.rahulstech.stt.dto.RegisterRequest;
import com.github.rahulstech.stt.error.HttpException;
import com.github.rahulstech.stt.model.User;
import com.github.rahulstech.stt.repository.UserRepository;
import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger("UserService");

    private final UserRepository userRepo;

    private final PasswordEncoder passwordEncoder;

    private final EntityManager entityManager;

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
        }
        catch(DataIntegrityViolationException e) {
            // unique constraint violation
            throw HttpException.conflict("email in use");
        }
        catch (Exception e) {
            logger.error(e.getMessage());
            throw HttpException.internalError();
        }
    }

    public User tryLogInOrThrow(LogInRequest req) {
        var user = userRepo.findUserByEmail(req.email()).orElse(null);
        if (user == null) {
            throw HttpException.notFound("user not found");
        }
        var passwordMatched = passwordEncoder.matches(req.password(), user.getPasswordHash());
        if (!passwordMatched) {
            throw HttpException.unauthorized("incorrect password");
        }
        return user;
    }

    public User getUserById(Long userId) {
        return entityManager.getReference(User.class, userId);
    }
}

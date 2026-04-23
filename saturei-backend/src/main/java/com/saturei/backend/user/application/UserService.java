package com.saturei.backend.user.application;

import com.saturei.backend.shared.exception.ApiException;
import com.saturei.backend.user.application.dto.LoginRequest;
import com.saturei.backend.user.application.dto.RegisterRequest;
import com.saturei.backend.user.domain.User;
import com.saturei.backend.user.domain.UserPermissions;
import com.saturei.backend.user.domain.UserRepository;
import com.saturei.backend.user.infrastructure.persistence.JpaUserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final JpaUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(RegisterRequest request){
        String normalizedEmail = normalizeEmail(request.email());
        String normalizedName = normalizeName(request.name());

        if(userRepository.existsByEmail(normalizedEmail)){
            throw ApiException.conflict("E-mail already in use.");
        }

        User user = User.builder()
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.password()))
                .name(normalizedName)
                .permissions(List.of(UserPermissions.BUYER))
                .build();

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User login(LoginRequest request){
        String normalizedEmail = normalizeEmail(request.email());

        User user = userRepository.findByEmail(normalizedEmail).orElseThrow(() -> ApiException.unauthorized("Invalid credentials."));

        if(!passwordEncoder.matches(request.password(), user.getPassword())){
            throw ApiException.unauthorized("Invalid credentials.");
        }

        return user;
    }

    @Transactional(readOnly = true)
    public User getProfileById(UUID userId){
        return userRepository.findById(userId).orElseThrow(() -> ApiException.notFound("User not found."));
    }

    @Transactional(readOnly = true)
    public User getProfileByEmail(String email){
        return userRepository.findByEmail(normalizeEmail(email)).orElseThrow(() -> ApiException.notFound("User not found."));
    }

    private String normalizeEmail(String email){
        return email.trim().toLowerCase();
    }

    private String normalizeName(String name){
        return name.trim().replaceAll("\\s+", " ");
    }
}

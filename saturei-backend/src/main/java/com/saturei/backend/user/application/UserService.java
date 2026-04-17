package com.saturei.backend.user.application;

import com.saturei.backend.user.infrastructure.persistence.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final JpaUserRepository userRepository;

    // TODO: implement register, login, getProfile
}

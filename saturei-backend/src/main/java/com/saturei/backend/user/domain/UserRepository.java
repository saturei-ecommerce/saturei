package com.saturei.backend.user.domain;

import java.util.Optional;

public interface UserRepository {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}

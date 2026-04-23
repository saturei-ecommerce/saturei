package com.saturei.backend.user.application.dto;

import com.saturei.backend.user.domain.User;
import com.saturei.backend.user.domain.UserPermissions;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record UserResponse (
    UUID id,
    String email,
    String name,
    String avatarUrl,
    List<UserPermissions> permissions,
    LocalDateTime createdAt
){
    public static UserResponse from(User user){
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getAvatarUrl(),
                user.getPermissions(),
                user.getCreatedAt()
        );
    }
}

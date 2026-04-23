package com.saturei.backend.user.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "E-mail is required.")
        @Email(message = "E-mail must be valid.")
        String email,

        @NotBlank(message = "Password is required")
        String password
) {}

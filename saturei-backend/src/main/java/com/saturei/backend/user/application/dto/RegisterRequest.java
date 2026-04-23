package com.saturei.backend.user.application.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "E-mail is required.")
        @Email(message = "E-mail must be valid.")
        String email,

        @NotBlank(message = "Password is required.")
        @Size(min = 8, message = "Password must have at least 8 .")
        String password,

        @NotBlank(message = "Name is required.")
        String name
) {}

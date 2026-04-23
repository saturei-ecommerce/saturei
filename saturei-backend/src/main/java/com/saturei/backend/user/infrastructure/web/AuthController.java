package com.saturei.backend.user.infrastructure.web;

import com.saturei.backend.shared.security.JwtService;
import com.saturei.backend.user.application.UserService;
import com.saturei.backend.user.application.dto.AuthResponse;
import com.saturei.backend.user.application.dto.LoginRequest;
import com.saturei.backend.user.application.dto.RegisterRequest;
import com.saturei.backend.user.application.dto.UserResponse;
import com.saturei.backend.user.domain.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserResponse.from(userService.register(request)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request){
        User user = userService.login(request);

        String accessToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return ResponseEntity.ok(AuthResponse.of(accessToken, refreshToken, UserResponse.from(user)));
    }
}

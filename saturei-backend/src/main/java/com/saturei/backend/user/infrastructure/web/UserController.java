package com.saturei.backend.user.infrastructure.web;

import com.saturei.backend.shared.exception.ApiException;
import com.saturei.backend.user.application.UserService;
import com.saturei.backend.user.application.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getProfileById(Authentication authentication){
        if(authentication == null || authentication.getName() == null){
            throw ApiException.unauthorized("User is not authenticated.");
        }

        return ResponseEntity.ok(UserResponse.from(userService.getProfileByEmail(authentication.getName())));
    }
}

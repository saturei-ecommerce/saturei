package com.saturei.backend.user.application;

import com.saturei.backend.shared.exception.ApiException;
import com.saturei.backend.user.application.dto.LoginRequest;
import com.saturei.backend.user.application.dto.RegisterRequest;
import com.saturei.backend.user.domain.User;
import com.saturei.backend.user.domain.UserPermissions;
import com.saturei.backend.user.infrastructure.persistence.JpaUserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private JpaUserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void registerShouldCreateUserSuccessfully() {
        RegisterRequest request = new RegisterRequest(
                "  USER@EMAIL.COM  ",
                "12345678",
                "  Saturei   User  "
        );

        when(userRepository.existsByEmail("user@email.com")).thenReturn(false);
        when(passwordEncoder.encode("12345678")).thenReturn("encoded-password");

        User savedUser = User.builder()
                .id(UUID.randomUUID())
                .email("user@email.com")
                .password("encoded-password")
                .name("Saturei User")
                .permissions(List.of(UserPermissions.BUYER))
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        User result = userService.register(request);

        assertNotNull(result);
        assertEquals("user@email.com", result.getEmail());
        assertEquals("Saturei User", result.getName());
        assertEquals("encoded-password", result.getPassword());
        assertEquals(List.of(UserPermissions.BUYER), result.getPermissions());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User userToSave = userCaptor.getValue();
        assertEquals("user@email.com", userToSave.getEmail());
        assertEquals("Saturei User", userToSave.getName());
        assertEquals("encoded-password", userToSave.getPassword());
        assertEquals(List.of(UserPermissions.BUYER), userToSave.getPermissions());

        verify(userRepository).existsByEmail("user@email.com");
        verify(passwordEncoder).encode("12345678");
    }

    @Test
    void registerShouldThrowConflictWhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest(
                "user@email.com",
                "12345678",
                "Saturei User"
        );

        when(userRepository.existsByEmail("user@email.com")).thenReturn(true);

        ApiException exception = assertThrows(ApiException.class, () -> userService.register(request));

        assertEquals(HttpStatus.CONFLICT, exception.getStatus());
        assertEquals("E-mail already in use.", exception.getMessage());

        verify(userRepository).existsByEmail("user@email.com");
        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void loginShouldReturnUserWhenCredentialsAreValid() {
        LoginRequest request = new LoginRequest("  USER@EMAIL.COM ", "12345678");

        User existingUser = User.builder()
                .id(UUID.randomUUID())
                .email("user@email.com")
                .password("encoded-password")
                .name("Saturei User")
                .permissions(List.of(UserPermissions.BUYER))
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.findByEmail("user@email.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("12345678", "encoded-password")).thenReturn(true);

        User result = userService.login(request);

        assertNotNull(result);
        assertEquals(existingUser.getId(), result.getId());
        assertEquals("user@email.com", result.getEmail());

        verify(userRepository).findByEmail("user@email.com");
        verify(passwordEncoder).matches("12345678", "encoded-password");
    }

    @Test
    void loginShouldThrowUnauthorizedWhenUserDoesNotExist() {
        LoginRequest request = new LoginRequest("user@email.com", "12345678");

        when(userRepository.findByEmail("user@email.com")).thenReturn(Optional.empty());

        ApiException exception = assertThrows(ApiException.class, () -> userService.login(request));

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatus());
        assertEquals("Invalid credentials.", exception.getMessage());

        verify(userRepository).findByEmail("user@email.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void loginShouldThrowUnauthorizedWhenPasswordIsInvalid() {
        LoginRequest request = new LoginRequest("user@email.com", "wrong-password");

        User existingUser = User.builder()
                .id(UUID.randomUUID())
                .email("user@email.com")
                .password("encoded-password")
                .name("Saturei User")
                .permissions(List.of(UserPermissions.BUYER))
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.findByEmail("user@email.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("wrong-password", "encoded-password")).thenReturn(false);

        ApiException exception = assertThrows(ApiException.class, () -> userService.login(request));

        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatus());
        assertEquals("Invalid credentials.", exception.getMessage());

        verify(userRepository).findByEmail("user@email.com");
        verify(passwordEncoder).matches("wrong-password", "encoded-password");
    }

    @Test
    void getProfileShouldReturnUserWhenIdExists() {
        UUID userId = UUID.randomUUID();

        User existingUser = User.builder()
                .id(userId)
                .email("user@email.com")
                .password("encoded-password")
                .name("Saturei User")
                .permissions(List.of(UserPermissions.BUYER))
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));

        User result = userService.getProfileById(userId);

        assertNotNull(result);
        assertEquals(userId, result.getId());
        assertEquals("user@email.com", result.getEmail());

        verify(userRepository).findById(userId);
    }

    @Test
    void getProfileShouldThrowNotFoundWhenIdDoesNotExist() {
        UUID userId = UUID.randomUUID();

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        ApiException exception = assertThrows(ApiException.class, () -> userService.getProfileById(userId));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatus());
        assertEquals("User not found.", exception.getMessage());

        verify(userRepository).findById(userId);
    }

    @Test
    void getProfileByEmailShouldReturnUserWhenEmailExists() {
        User existingUser = User.builder()
                .id(UUID.randomUUID())
                .email("user@email.com")
                .password("encoded-password")
                .name("Saturei User")
                .permissions(List.of(UserPermissions.BUYER))
                .createdAt(LocalDateTime.now())
                .build();

        when(userRepository.findByEmail("user@email.com")).thenReturn(Optional.of(existingUser));

        User result = userService.getProfileByEmail("  USER@EMAIL.COM ");

        assertNotNull(result);
        assertEquals("user@email.com", result.getEmail());

        verify(userRepository).findByEmail("user@email.com");
    }

    @Test
    void getProfileByEmailShouldThrowNotFoundWhenEmailDoesNotExist() {
        when(userRepository.findByEmail("user@email.com")).thenReturn(Optional.empty());

        ApiException exception = assertThrows(ApiException.class,
                () -> userService.getProfileByEmail("  USER@EMAIL.COM "));

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatus());
        assertEquals("User not found.", exception.getMessage());

        verify(userRepository).findByEmail("user@email.com");
    }
}
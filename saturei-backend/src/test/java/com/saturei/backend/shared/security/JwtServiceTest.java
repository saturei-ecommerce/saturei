package com.saturei.backend.shared.security;

import com.auth0.jwt.JWT;
import com.saturei.backend.user.domain.User;
import com.saturei.backend.user.infrastructure.persistence.JpaUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @Mock
    private JwtProperties jwtProperties;

    @Mock
    private JpaUserRepository userRepository;

    @InjectMocks
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        lenient().when(jwtProperties.getSecret()).thenReturn("test-secret-key-that-is-long-enough");
        lenient().when(jwtProperties.getIssuer()).thenReturn("saturei-backend");
        lenient().when(jwtProperties.getExpirationTimeInDays()).thenReturn(1L);
    }

    @Test
    void generateToken_shouldReturnValidJwt() {
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@test.com");

        String token = jwtService.generateToken(userDetails);

        assertNotNull(token);
        String subject = JWT.decode(token).getSubject();
        assertEquals("test@test.com", subject);
        assertEquals("access", JWT.decode(token).getClaim("type").asString());
    }

    @Test
    void generateRefreshToken_shouldReturnValidRefreshToken() {
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@test.com");

        String token = jwtService.generateRefreshToken(userDetails);

        assertNotNull(token);
        String subject = JWT.decode(token).getSubject();
        assertEquals("test@test.com", subject);
        assertEquals("refresh", JWT.decode(token).getClaim("type").asString());
    }

    @Test
    void extractUser_shouldReturnUser_whenTokenIsValid() {
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@test.com");

        String token = jwtService.generateToken(userDetails);
        User mockUser = mock(User.class);
        
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(mockUser));

        User user = jwtService.extractUser("Bearer " + token);
        assertEquals(mockUser, user);
    }

    @Test
    void extractUser_shouldThrowException_whenUserNotFound() {
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@test.com");

        String token = jwtService.generateToken(userDetails);
        
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> jwtService.extractUser("Bearer " + token));
    }

    @Test
    void isTokenExpired_shouldReturnFalse_forNewlyGeneratedToken() {
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@test.com");

        String token = jwtService.generateToken(userDetails);

        assertFalse(jwtService.isTokenExpired(token));
    }
}

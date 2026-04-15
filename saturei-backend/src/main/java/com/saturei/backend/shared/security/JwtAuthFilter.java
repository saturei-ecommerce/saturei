package com.saturei.backend.shared.security;

import com.auth0.jwt.exceptions.TokenExpiredException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.*;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {
    private final static String AUTH_HEADER = "Authorization";
    private final static String TOKEN_PREFIX = "Bearer ";

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = this.recoverToken(request);
        if (token != null) {
            UserDetails userDetails = jwtService.extractUser(token);
            boolean isTokenExpired = jwtService.isTokenExpired(token);

            if (isTokenExpired) {
                throw new TokenExpiredException("Token expired", jwtService.getTokenExpirationDate(token));
            }

            Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

            var authentication = new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader(AUTH_HEADER);
        if (authHeader == null) {
            return null;
        }
        return authHeader.replace(TOKEN_PREFIX, "");
    }
}

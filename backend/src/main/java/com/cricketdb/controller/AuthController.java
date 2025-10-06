package com.cricketdb.controller;

import com.cricketdb.dto.LoginRequest;
import com.cricketdb.dto.LoginResponse;
import com.cricketdb.model.Role;
import com.cricketdb.model.User;
import com.cricketdb.security.JwtUtil;
import com.cricketdb.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user);
        
        return ResponseEntity.ok(new LoginResponse(
                token,
                user.getEmail(),
                user.getRole(),
                "Login successful"
        ));
    }
    
    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Register a new user (Admin only)")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody LoginRequest request) {
        User user = userService.createUser(request.getEmail(), request.getPassword(), Role.ADMIN);
        String token = jwtUtil.generateToken(user);
        
        return ResponseEntity.ok(new LoginResponse(
                token,
                user.getEmail(),
                user.getRole(),
                "Registration successful"
        ));
    }
}

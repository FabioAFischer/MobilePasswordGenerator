package com.passwordgenerator.passwordgenerator.controller;

import com.passwordgenerator.passwordgenerator.dto.AuthRequestDTO;
import com.passwordgenerator.passwordgenerator.dto.AuthResponseDTO;
import com.passwordgenerator.passwordgenerator.dto.UserCreateDTO;
import com.passwordgenerator.passwordgenerator.dto.UserResponseDTO;
import com.passwordgenerator.passwordgenerator.service.AuthService;
import com.passwordgenerator.passwordgenerator.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@Valid @RequestBody UserCreateDTO request) {
        UserResponseDTO response = userService.criar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody AuthRequestDTO request) {
        AuthResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}

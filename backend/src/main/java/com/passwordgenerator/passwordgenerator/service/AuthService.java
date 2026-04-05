package com.passwordgenerator.passwordgenerator.service;

import com.passwordgenerator.passwordgenerator.dto.AuthRequestDTO;
import com.passwordgenerator.passwordgenerator.dto.AuthResponseDTO;
import com.passwordgenerator.passwordgenerator.dto.UserResponseDTO;
import com.passwordgenerator.passwordgenerator.entity.User;
import com.passwordgenerator.passwordgenerator.repository.UserRepository;
import com.passwordgenerator.passwordgenerator.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponseDTO login(AuthRequestDTO dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));

        if (!passwordEncoder.matches(dto.senha(), user.getSenhaHash())) {
            throw new RuntimeException("Email ou senha inválidos");
        }

        String token = jwtService.gerarToken(user);
        UserResponseDTO userResponse = new UserResponseDTO(user.getId(), user.getNome(), user.getEmail());

        return new AuthResponseDTO(token, userResponse);
    }
}

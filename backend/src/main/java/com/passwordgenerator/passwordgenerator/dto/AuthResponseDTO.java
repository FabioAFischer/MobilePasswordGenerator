package com.passwordgenerator.passwordgenerator.dto;

public record AuthResponseDTO(
    String token,
    UserResponseDTO user
) {}

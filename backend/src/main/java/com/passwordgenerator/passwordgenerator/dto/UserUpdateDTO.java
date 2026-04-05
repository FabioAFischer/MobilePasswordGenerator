package com.passwordgenerator.passwordgenerator.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UserUpdateDTO(
    @Size(max = 180, message = "Nome não pode ter mais de 180 caracteres")
    String nome,

    @Email(message = "Email deve ser válido")
    @Size(max = 180, message = "Email não pode ter mais de 180 caracteres")
    String email,

    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    String senha
) {}

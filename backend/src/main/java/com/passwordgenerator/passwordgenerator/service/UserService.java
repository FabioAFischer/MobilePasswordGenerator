package com.passwordgenerator.passwordgenerator.service;

import com.passwordgenerator.passwordgenerator.dto.UserCreateDTO;
import com.passwordgenerator.passwordgenerator.dto.UserResponseDTO;
import com.passwordgenerator.passwordgenerator.dto.UserUpdateDTO;
import com.passwordgenerator.passwordgenerator.entity.User;
import com.passwordgenerator.passwordgenerator.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO criar(UserCreateDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new RuntimeException("Usuário com este email já existe");
        }

        User user = new User();
        user.setNome(dto.nome());
        user.setEmail(dto.email());
        user.setSenhaHash(passwordEncoder.encode(dto.senha()));

        User usuarioSalvo = userRepository.save(user);
        
        return new UserResponseDTO(usuarioSalvo.getId(), usuarioSalvo.getNome(), usuarioSalvo.getEmail());
    }

    public List<UserResponseDTO> listarTodos() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponseDTO(user.getId(), user.getNome(), user.getEmail()))
                .toList();
    }

    public UserResponseDTO buscarPorId(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        return new UserResponseDTO(user.getId(), user.getNome(), user.getEmail());
    }

    public UserResponseDTO atualizar(Long id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (dto.nome() != null && !dto.nome().isBlank()) {
            user.setNome(dto.nome());
        }

        if (dto.email() != null && !dto.email().isBlank()) {
            if (!user.getEmail().equals(dto.email()) && userRepository.existsByEmail(dto.email())) {
                throw new RuntimeException("Email já está em uso");
            }
            user.setEmail(dto.email());
        }

        if (dto.senha() != null && !dto.senha().isBlank()) {
            user.setSenhaHash(passwordEncoder.encode(dto.senha()));
        }

        User usuarioAtualizado = userRepository.save(user);
        
        return new UserResponseDTO(usuarioAtualizado.getId(), usuarioAtualizado.getNome(), usuarioAtualizado.getEmail());
    }

    public void deletar(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Usuário não encontrado");
        }
        
        userRepository.deleteById(id);
    }

    public User buscarPorEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}

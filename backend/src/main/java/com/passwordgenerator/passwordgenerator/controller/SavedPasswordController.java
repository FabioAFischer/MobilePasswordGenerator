package com.passwordgenerator.passwordgenerator.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.passwordgenerator.passwordgenerator.dto.SavedPasswordRequest;
import com.passwordgenerator.passwordgenerator.entity.SavedPassword;
import com.passwordgenerator.passwordgenerator.entity.User;
import com.passwordgenerator.passwordgenerator.repository.UserRepository;
import com.passwordgenerator.passwordgenerator.service.SavedPasswordService;

@RestController
@RequestMapping("/senhas")
public class SavedPasswordController {

    private final SavedPasswordService service;
    private final UserRepository userRepository;

    public SavedPasswordController(SavedPasswordService service, UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            return null;
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    }

    @GetMapping
    public ResponseEntity<?> listar() {
        User u = getCurrentUser();
        List<SavedPassword> list = service.listForUser(u);
        List<Map<String, Object>> out = list.stream().map(s -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", s.getId());
            m.put("nomeAplicativo", s.getNomeAplicativo());
            m.put("senha", s.getSenha());
            return m;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(out);
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody SavedPasswordRequest req) {
        try {
            User u = getCurrentUser();
            SavedPassword created = service.createForUser(u, req);
            Map<String, Object> m = new HashMap<>();
            m.put("id", created.getId());
            m.put("nomeAplicativo", created.getNomeAplicativo());
            m.put("senha", created.getSenha());
            return ResponseEntity.ok(m);
        } catch (IllegalArgumentException ex) {
            Map<String, String> err = Collections.singletonMap("mensagem", ex.getMessage());
            return ResponseEntity.badRequest().body(err);
        } catch (Exception ex) {
            Map<String, String> err = Collections.singletonMap("mensagem", "Erro ao salvar senha");
            return ResponseEntity.status(500).body(err);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            User u = getCurrentUser();
            service.deleteForUser(u, id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            Map<String, String> err = Collections.singletonMap("mensagem", ex.getMessage());
            return ResponseEntity.status(404).body(err);
        } catch (SecurityException ex) {
            Map<String, String> err = Collections.singletonMap("mensagem", ex.getMessage());
            return ResponseEntity.status(403).body(err);
        } catch (Exception ex) {
            Map<String, String> err = Collections.singletonMap("mensagem", "Erro ao deletar senha");
            return ResponseEntity.status(500).body(err);
        }
    }
}

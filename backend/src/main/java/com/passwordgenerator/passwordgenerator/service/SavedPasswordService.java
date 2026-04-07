package com.passwordgenerator.passwordgenerator.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.passwordgenerator.passwordgenerator.dto.SavedPasswordRequest;
import com.passwordgenerator.passwordgenerator.entity.SavedPassword;
import com.passwordgenerator.passwordgenerator.entity.User;
import com.passwordgenerator.passwordgenerator.repository.SavedPasswordRepository;

@Service
public class SavedPasswordService {

    private final SavedPasswordRepository repository;

    public SavedPasswordService(SavedPasswordRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<SavedPassword> listForUser(User user) {
        return repository.findByUser(user);
    }

    @Transactional
    public SavedPassword createForUser(User user, SavedPasswordRequest req) {
        String nomeNormalizado = req.getNomeAplicativo() == null ? "" : req.getNomeAplicativo().trim().toLowerCase();
        // Busca por nome normalizado (trim + lower)
        Optional<SavedPassword> exists = repository.findByUserAndNomeAplicativoNormalized(user, nomeNormalizado);
        if (exists.isPresent()) {
            throw new IllegalArgumentException("Já existe uma senha salva com esse nome");
        }
        SavedPassword s = new SavedPassword();
        s.setNomeAplicativo(req.getNomeAplicativo() == null ? "" : req.getNomeAplicativo().trim());
        s.setSenha(req.getSenha());
        s.setUser(user);
        return repository.save(s);
    }

    @Transactional
    public void deleteForUser(User user, Long id) {
        Optional<SavedPassword> opt = repository.findById(id);
        if (!opt.isPresent()) {
            throw new IllegalArgumentException("Senha não encontrada.");
        }
        SavedPassword s = opt.get();
        if (!s.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Operação não permitida.");
        }
        repository.delete(s);
    }
}

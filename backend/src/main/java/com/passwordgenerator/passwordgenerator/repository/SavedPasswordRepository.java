package com.passwordgenerator.passwordgenerator.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.passwordgenerator.passwordgenerator.entity.SavedPassword;
import com.passwordgenerator.passwordgenerator.entity.User;

@Repository
public interface SavedPasswordRepository extends JpaRepository<SavedPassword, Long> {
    List<SavedPassword> findByUser(User user);

    // Busca por nome normalizado (lowercase + trim)
    Optional<SavedPassword> findByUserAndNomeAplicativoIgnoreCase(User user, String nomeAplicativo);

    // Busca por nome normalizado manualmente (caso ignoreCase não funcione para trim)
    default Optional<SavedPassword> findByUserAndNomeAplicativoNormalized(User user, String nomeAplicativo) {
        if (nomeAplicativo == null) return Optional.empty();
        String normalized = nomeAplicativo.trim().toLowerCase();
        return findByUser(user).stream()
            .filter(s -> s.getNomeAplicativo() != null && s.getNomeAplicativo().trim().toLowerCase().equals(normalized))
            .findFirst();
    }
}

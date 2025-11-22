package com.cafeteria.MenuVersiones.repositorios;

import com.cafeteria.MenuVersiones.clases.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar un usuario por username
    Optional<Usuario> findByUsername(String username);

    // Verificar si existe un username
    boolean existsByUsername(String username);
}
package com.cafeteria.MenuVersiones.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.cafeteria.MenuVersiones.clases.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsuario(String usuario);
    Optional<Usuario> findByCorreo(String correo);
}
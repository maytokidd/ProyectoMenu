package com.cafeteria.MenuVersiones.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cafeteria.MenuVersiones.clases.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByUsuario(String usuario);
    Usuario findByCorreo(String correo);
}
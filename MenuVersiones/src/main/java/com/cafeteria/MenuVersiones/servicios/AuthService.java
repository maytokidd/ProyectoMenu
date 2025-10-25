package com.cafeteria.MenuVersiones.servicios;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Valida las credenciales de un usuario.
     * @param username Nombre de usuario.
     * @param password Contraseña sin encriptar.
     * @param requestedRol Rol seleccionado.
     * @return El objeto Usuario si la autenticación es exitosa, o null si falla.
     */
    public Usuario login(String username, String password, String requestedRol) {
        
        // 1. Buscar el usuario por nombre de usuario
        Usuario usuario = usuarioRepository.findByUsername(username)
            .orElse(null); // Retorna null si no se encuentra el usuario

        if (usuario == null) {
            return null; // Usuario no encontrado
        }

        // 2. Verificar la contraseña encriptada (Usa BCrypt)
        // Se asume que la contraseña en la DB está encriptada.
        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            return null; // Contraseña incorrecta
        }
        
        // 3. Verificar que el rol coincida
        // Se usa .equalsIgnoreCase para no ser sensible a mayúsculas/minúsculas
        if (!usuario.getRol().equalsIgnoreCase(requestedRol)) {
            // Podrías devolver un mensaje de error diferente aquí, 
            // pero por simplicidad, lo tratamos como un fallo de credenciales
             return null; 
        }

        // 4. Autenticación exitosa
        return usuario;
    }
}
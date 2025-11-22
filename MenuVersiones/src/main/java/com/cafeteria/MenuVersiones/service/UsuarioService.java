package com.cafeteria.MenuVersiones.service;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Para encriptar contraseñas

    // verificar credenciales
    public boolean verificarCredenciales(String username, String rawPassword, String rol) {
        Optional<Usuario> optionalUsuario = buscarPorUsername(username);
        if(optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();
            return passwordEncoder.matches(rawPassword, usuario.getPassword())
                    && usuario.getRol().equalsIgnoreCase(rol);
        }
        return false;
    }

    // Obtener todos los usuarios
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // Crear un usuario
    public Usuario crearUsuario(Usuario usuario) {
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepository.save(usuario);
    }

    // Actualizar usuario
    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);
        if (optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();
            usuario.setNombre(usuarioActualizado.getNombre());
            usuario.setApellido(usuarioActualizado.getApellido());
            usuario.setEmail(usuarioActualizado.getEmail());
            usuario.setUsername(usuarioActualizado.getUsername());
            usuario.setRol(usuarioActualizado.getRol());
            usuario.setEstado(usuarioActualizado.getEstado());

            if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {
                usuario.setPassword(passwordEncoder.encode(usuarioActualizado.getPassword()));
            }

            return usuarioRepository.save(usuario);
        } else {
            throw new RuntimeException("Usuario no encontrado con id: " + id);
        }
    }

    // Método para editar usuario (controller usa este nombre)
    public Usuario editarUsuario(Long id, Usuario usuario) {
        return actualizarUsuario(id, usuario);
    }

    // Eliminar usuario
    public boolean eliminarUsuario(Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Activar / desactivar usuario
    public Usuario cambiarEstado(Long id, String estado) {
        Optional<Usuario> optionalUsuario = usuarioRepository.findById(id);
        if (optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();
            usuario.setEstado(estado);
            return usuarioRepository.save(usuario);
        } else {
            throw new RuntimeException("Usuario no encontrado con id: " + id);
        }
    }

    // Buscar usuario por username
    public Optional<Usuario> buscarPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }
}
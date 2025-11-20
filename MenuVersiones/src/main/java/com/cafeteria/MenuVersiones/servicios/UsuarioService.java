package com.cafeteria.MenuVersiones.servicios;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.Enum.Estado;
import com.cafeteria.MenuVersiones.repositorios.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Crear nuevo usuario
    public Usuario crearUsuario(Usuario usuario) {
        usuario.setClave(passwordEncoder.encode(usuario.getClave()));
        return usuarioRepository.save(usuario);
    }

    // Listar todos los usuarios
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // Buscar por nombre de usuario
    public Optional<Usuario> buscarPorUsuario(String usuario) {
        return usuarioRepository.findByUsuario(usuario);
    }

    // Buscar por correo
    public Optional<Usuario> buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    // Buscar por ID
    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    // Editar usuario (usando la entidad completa)
    public Usuario editarUsuario(Usuario u) {
        // Si la contraseña fue modificada, la encripta
        if (u.getClave() != null) {
            u.setClave(passwordEncoder.encode(u.getClave()));
        }
        return usuarioRepository.save(u);
    }

    // Editar usuario por ID (para controller PUT /{id})
    public Usuario editarUsuario(Long id, Usuario u) {
        Optional<Usuario> existenteOpt = usuarioRepository.findById(id);
        if (existenteOpt.isPresent()) {
            Usuario existente = existenteOpt.get();
            existente.setUsuario(u.getUsuario() != null ? u.getUsuario() : existente.getUsuario());
            existente.setCorreo(u.getCorreo() != null ? u.getCorreo() : existente.getCorreo());
            existente.setRol(u.getRol() != null ? u.getRol() : existente.getRol());
            existente.setEstado(u.getEstado() != null ? u.getEstado() : existente.getEstado());
            if (u.getClave() != null && !u.getClave().isEmpty()) {
                existente.setClave(passwordEncoder.encode(u.getClave()));
            }
            return usuarioRepository.save(existente);
        }
        return null;
    }

    // Eliminar usuario por ID
    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

    // Validar contraseña con BCrypt
    public boolean validarPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    // Validar si el usuario puede loguearse (activo)
    public boolean puedeLoguearse(Usuario u) {
        return u.getEstado() == Estado.Activo;
    }

    // Login principal
    public Usuario login(String usuario, String clave) {
        Optional<Usuario> userOpt = usuarioRepository.findByUsuario(usuario);
        if (userOpt.isPresent()) {
            Usuario user = userOpt.get();
            if (validarPassword(clave, user.getClave()) && puedeLoguearse(user)) {
                return user;
            }
        }
        return null;
    }
}
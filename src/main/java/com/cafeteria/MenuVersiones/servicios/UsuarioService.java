package com.cafeteria.MenuVersiones.servicios;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.Enum.Estado;
import com.cafeteria.MenuVersiones.repositorios.UsuarioRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          BCryptPasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
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

    // Buscar por usuario
    public Usuario buscarPorUsuario(String usuario) {
        return usuarioRepository.findByUsuario(usuario);
    }

    // Buscar por correo
    public Usuario buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }

    // Buscar por ID
    public Usuario findById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    // Editar usuario completo
    public Usuario editarUsuario(Usuario u) {

        if (u.getClave() != null && !u.getClave().isEmpty()) {
            u.setClave(passwordEncoder.encode(u.getClave()));
        }

        return usuarioRepository.save(u);
    }

    // Editar usuario por ID
    public Usuario editarUsuario(Long id, Usuario u) {
        Usuario existente = usuarioRepository.findById(id).orElse(null);

        if (existente == null) return null;

        existente.setUsuario(
                u.getUsuario() != null ? u.getUsuario() : existente.getUsuario()
        );
        existente.setCorreo(
                u.getCorreo() != null ? u.getCorreo() : existente.getCorreo()
        );
        existente.setRol(
                u.getRol() != null ? u.getRol() : existente.getRol()
        );
        existente.setEstado(
                u.getEstado() != null ? u.getEstado() : existente.getEstado()
        );

        if (u.getClave() != null && !u.getClave().isEmpty()) {
            existente.setClave(passwordEncoder.encode(u.getClave()));
        }

        return usuarioRepository.save(existente);
    }

    // Eliminar usuario
    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

    // Validar password BCrypt
    public boolean validarPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    // Verificar estado
    public boolean puedeLoguearse(Usuario u) {
        return u.getEstado() == Estado.Activo;
    }

    // LOGIN PRINCIPAL
    public Usuario login(String usuario, String clave) {

        Usuario user = usuarioRepository.findByUsuario(usuario);
        if (user == null) return null;

        boolean ok = passwordEncoder.matches(clave, user.getClave());
        if (!ok) return null;

        if (!puedeLoguearse(user)) return null;

        return user;
    }
}
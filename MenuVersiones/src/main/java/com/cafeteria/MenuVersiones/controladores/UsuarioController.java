package com.cafeteria.MenuVersiones.controladores;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.service.UsuarioService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // =============================
    // LISTAR TODOS LOS USUARIOS
    // =============================
    @GetMapping
    public List<Usuario> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    // =============================
    // CREAR USUARIO
    // =============================
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioService.crearUsuario(usuario);
    }

    // =============================
    // EDITAR USUARIO
    // =============================
    @PutMapping("/{id}")
    public Usuario editarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        return usuarioService.editarUsuario(id, usuario);
    }

    // =============================
    // CAMBIAR ESTADO (ACTIVO/INACTIVO)
    // =============================
    @PatchMapping("/{id}/estado")
    public Usuario cambiarEstado(@PathVariable Long id, @RequestParam String estado) {
        return usuarioService.cambiarEstado(id, estado);
    }

    // =============================
    // ELIMINAR USUARIO
    // =============================
    @DeleteMapping("/{id}")
    public String eliminarUsuario(@PathVariable Long id) {
        boolean eliminado = usuarioService.eliminarUsuario(id);
        return eliminado ? "Usuario eliminado correctamente" : "No se encontró el usuario";
    }

    // =============================
    // BUSCAR POR USERNAME
    // =============================
    @GetMapping("/buscar")
    public Optional<Usuario> buscarPorUsername(@RequestParam String username) {
        return usuarioService.buscarPorUsername(username);
    }

    // =============================
    // OBTENER USUARIO LOGUEADO
    // (NECESARIO PARA ventas_user.js)
    // =============================
    @GetMapping("/mi-info")
    public Map<String, Object> obtenerMiUsuario(HttpSession session) {

        String username = (String) session.getAttribute("usuario");

        Map<String, Object> data = new HashMap<>();
        data.put("username", username);

        return data;
    }
 // =============================
// OBTENER DATOS COMPLETOS DEL USUARIO LOGUEADO
// =============================
@GetMapping("/mi-perfil")
public Map<String, Object> obtenerMiPerfil(HttpSession session) {

    String username = (String) session.getAttribute("usuario");

    Map<String, Object> response = new HashMap<>();

    if (username == null) {
        response.put("error", "No hay usuario en sesión");
        return response;
    }

    Optional<Usuario> usuario = usuarioService.buscarPorUsername(username);

    if (usuario.isEmpty()) {
        response.put("error", "Usuario no encontrado");
        return response;
    }

    response.put("usuario", usuario.get());
    return response;
}
// =============================
// CAMBIAR CONTRASEÑA
// =============================
@PatchMapping("/{id}/password")
public Usuario cambiarPassword(@PathVariable Long id, @RequestParam String nuevaPassword) {
    return usuarioService.cambiarPassword(id, nuevaPassword);
}

}

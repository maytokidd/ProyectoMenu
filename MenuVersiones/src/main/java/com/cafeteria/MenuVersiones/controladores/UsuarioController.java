package com.cafeteria.MenuVersiones.controladores;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
}

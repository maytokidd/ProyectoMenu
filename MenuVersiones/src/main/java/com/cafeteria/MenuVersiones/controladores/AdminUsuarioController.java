package com.cafeteria.MenuVersiones.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.servicios.UsuarioService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class AdminUsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listarUsuarios();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        Optional<Usuario> u = usuarioService.findById(id);
        return u.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Usuario usuario) {
        // crearUsuario encripta la clave
        Usuario saved = usuarioService.crearUsuario(usuario);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody Usuario data) {
        Optional<Usuario> u = usuarioService.findById(id);
        if (u.isEmpty()) return ResponseEntity.notFound().build();
    
        Usuario usu = u.get();
    
        // 1. Actualizar campos que no son clave
        usu.setCorreo(data.getCorreo());
        usu.setUsuario(data.getUsuario());
        usu.setRol(data.getRol());
        usu.setEstado(data.getEstado());
    
        // 2. Manejar la clave:
        if (data.getClave() != null && !data.getClave().isBlank()) {
        // Usa crearUsuario para ENCRIPTAR y guardar la nueva clave
            usu.setClave(data.getClave());
            usu = usuarioService.crearUsuario(usu); 
        } else {
        // Si la clave es nula/vacía, usa editarUsuario (o save) que NO ENCRIPTA
            usu = usuarioService.editarUsuario(usu); // <--- DEBE SER UN MÉTODO QUE NO RE-ENCRIPTE
        }
    
        return ResponseEntity.ok(usu);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
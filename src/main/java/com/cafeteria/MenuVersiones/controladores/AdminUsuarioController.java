package com.cafeteria.MenuVersiones.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.servicios.UsuarioService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "*")
public class AdminUsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // LISTAR
    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listarUsuarios();
    }

    // OBTENER POR ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        Usuario u = usuarioService.findById(id);

        if (u == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(u);
    }

    // CREAR
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Usuario usuario) {
        Usuario saved = usuarioService.crearUsuario(usuario);
        return ResponseEntity.ok(saved);
    }

    // EDITAR
    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody Usuario data) {

        Usuario actualizado = usuarioService.editarUsuario(id, data);

        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(actualizado);
    }

    // ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.ok().build();
    }
}
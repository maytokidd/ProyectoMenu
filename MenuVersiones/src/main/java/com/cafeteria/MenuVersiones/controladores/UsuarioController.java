package com.cafeteria.MenuVersiones.controladores;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // Importante
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*") 
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inyectamos el cifrador


    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    // CREAR UN NUEVO USUARIO (CREATE) - CIFRANDO LA CLAVE
    @PostMapping
    public ResponseEntity<Usuario> createUsuario(@RequestBody Usuario nuevoUsuario) {
        
        // PASO CRÍTICO: Cifrar la clave antes de guardar
        String claveCifrada = passwordEncoder.encode(nuevoUsuario.getPassword());
        nuevoUsuario.setPassword(claveCifrada);
        
        Usuario usuarioGuardado = usuarioRepository.save(nuevoUsuario);
        return ResponseEntity.ok(usuarioGuardado);
    }

    // ACTUALIZAR UN USUARIO POR ID (UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable Long id, @RequestBody Usuario detallesUsuario) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);

        if (usuarioOpt.isPresent()) {
            Usuario usuarioExistente = usuarioOpt.get();
            
            // Actualizar campos que no son la clave
            usuarioExistente.setUsername(detallesUsuario.getUsername());
            usuarioExistente.setNombre(detallesUsuario.getNombre());
            usuarioExistente.setApellido(detallesUsuario.getApellido());
            usuarioExistente.setEmail(detallesUsuario.getEmail());
            usuarioExistente.setRol(detallesUsuario.getRol());

            // Solo actualiza la clave si se provee una nueva (cifrándola de nuevo)
            if (detallesUsuario.getPassword() != null && !detallesUsuario.getPassword().isEmpty()) {
                String nuevaClaveCifrada = passwordEncoder.encode(detallesUsuario.getPassword());
                usuarioExistente.setPassword(nuevaClaveCifrada);
            }
            
            return ResponseEntity.ok(usuarioRepository.save(usuarioExistente));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    // ELIMINAR UN USUARIO POR ID (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
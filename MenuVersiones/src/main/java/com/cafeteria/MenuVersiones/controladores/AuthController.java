package com.cafeteria.MenuVersiones.controladores;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.repositorios.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth") // Endpoint base para autenticación: /api/auth
@CrossOrigin(origins = "*") // Permite la comunicación desde tu login.html
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // Inyectamos el cifrador para VERIFICAR claves

    // Clase interna para mapear el JSON que llega desde el Frontend (login.js)
    static class LoginRequest {
        public String username;
        public String password;
        public String rol; // El rol que seleccionó el usuario
    }

    // Endpoint: POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Map<String, Object> response = new HashMap<>();

        // 1. Buscar al usuario por el username (ej. 'admin_julio')
        Optional<Usuario> userOptional = usuarioRepository.findByUsername(request.username);

        if (userOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "Credenciales incorrectas: Usuario no encontrado.");
            return ResponseEntity.ok(response);
        }

        Usuario user = userOptional.get();

        // 2. Verificar la Clave: Compara la clave plana (request.password) con la clave CIFRADA (user.getPassword())
        if (passwordEncoder.matches(request.password, user.getPassword())) {
            
            // 3. Verificar Rol: El usuario debe tener el rol que seleccionó en el login
            if (user.getRol().equalsIgnoreCase(request.rol)) {
                
                // AUTENTICACIÓN EXITOSA
                response.put("success", true);
                response.put("message", "Acceso concedido.");
                response.put("rol", user.getRol());
                return ResponseEntity.ok(response);
            } else {
                // FALLA DE ROL
                response.put("success", false);
                response.put("message", "Rol seleccionado no coincide con el usuario.");
                return ResponseEntity.ok(response);
            }
        } else {
            // FALLA DE CLAVE
            response.put("success", false);
            response.put("message", "Credenciales incorrectas: Contraseña inválida.");
            return ResponseEntity.ok(response);
        }
    }
}
package com.cafeteria.MenuVersiones.controladores;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.clases.LoginRequest;
import com.cafeteria.MenuVersiones.servicios.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // Ruta base para todos los endpoints de autenticación
public class AuthController {

    @Autowired
    private AuthService authService;

    // Este es el endpoint que el login.js está llamando con fetch()
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        
        // 1. Llamar al servicio para autenticar
        Usuario authenticatedUser = authService.login(
            loginRequest.getUsername(),
            loginRequest.getPassword(),
            loginRequest.getRol()
        );

        // 2. Manejar la respuesta
        if (authenticatedUser != null) {
            // Éxito: Devuelve un estado 200 OK y puedes enviar datos del usuario
            // En un sistema real, aquí generarías un token JWT y lo devolverías.
            
            // Ejemplo de redirección/respuesta simple (Spring maneja la redirección real)
            return ResponseEntity.ok()
                .body(new AuthResponse("Login exitoso. Bienvenido " + authenticatedUser.getRol()));
        } else {
            // Fallo: Devuelve un estado 401 Unauthorized (No autorizado)
            // El 'catch' de tu login.js recibirá este error.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new AuthResponse("Credenciales o rol incorrecto."));
        }
    }
    
    // Clase auxiliar para dar una respuesta JSON simple
    static class AuthResponse {
        private String message;
        public AuthResponse(String message) { this.message = message; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}

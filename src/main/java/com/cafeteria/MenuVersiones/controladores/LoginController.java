package com.cafeteria.MenuVersiones.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.servicios.UsuarioService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Usuario u = usuarioService.login(request.getUsuario(), request.getClave());

        if (u == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Usuario o clave incorrecta"));
        }

        // 🔥 Convertimos el enum a String y luego a mayúsculas
        String rolFormateado = u.getRol().name().toUpperCase();

        return ResponseEntity.ok(
                new LoginResponse(
                    true,
                    rolFormateado,
                    u.getUsuario(),
                    u.getCorreo()
                )
        );
    }

    // ---------- DTOs ----------
    static class LoginRequest {
        private String usuario;
        private String clave;

        public String getUsuario() { return usuario; }
        public void setUsuario(String usuario) { this.usuario = usuario; }

        public String getClave() { return clave; }
        public void setClave(String clave) { this.clave = clave; }
    }

    static class LoginResponse {
        private boolean exito;
        private String rol;
        private String usuario;
        private String correo;

        public LoginResponse(boolean exito, String rol, String usuario, String correo) {
            this.exito = exito;
            this.rol = rol;
            this.usuario = usuario;
            this.correo = correo;
        }

        public boolean isExito() { return exito; }
        public String getRol() { return rol; }
        public String getUsuario() { return usuario; }
        public String getCorreo() { return correo; }
    }

    static class ApiResponse {
        private boolean exito;
        private String mensaje;

        public ApiResponse(boolean exito, String mensaje) {
            this.exito = exito;
            this.mensaje = mensaje;
        }

        public boolean isExito() { return exito; }
        public String getMensaje() { return mensaje; }
    }
}
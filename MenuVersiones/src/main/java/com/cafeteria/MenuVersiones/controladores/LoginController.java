package com.cafeteria.MenuVersiones.controladores;

import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("/login-validar")
    public ResponseEntity<?> login(@RequestBody LoginRequest rq) {

        Usuario u = usuarioService.login(rq.getUsuario(), rq.getClave());
        if (u == null) {
            return ResponseEntity.status(401).body(new ApiResponse(false, "Usuario o clave incorrecta / usuario inactivo"));
        }

        LoginResponse resp = new LoginResponse(
                true,
                u.getRol().toString(),
                u.getUsuario(),
                u.getCorreo()
        );

        return ResponseEntity.ok(resp);
    }

    // --- Clases internas para request / response ---
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
            this.exito = exito; this.rol = rol; this.usuario = usuario; this.correo = correo;
        }
        public boolean isExito() { return exito; }
        public String getRol() { return rol; }
        public String getUsuario() { return usuario; }
        public String getCorreo() { return correo; }
    }

    static class ApiResponse {
        private boolean exito;
        private String mensaje;
        public ApiResponse(boolean exito, String mensaje) { this.exito = exito; this.mensaje = mensaje; }
        public boolean isExito() { return exito; }
        public String getMensaje() { return mensaje; }
    }
}
package com.cafeteria.MenuVersiones.controladores;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.service.UsuarioService;

import jakarta.servlet.http.HttpSession;

@RestController
public class LoginController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login-validar")
    public Map<String, Object> validar(@RequestBody Map<String, String> datos, HttpSession session) {

        String username = datos.get("usuario");
        String clave = datos.get("clave");
        String rol = datos.get("rol");

        Map<String, Object> resp = new HashMap<>();

        Optional<Usuario> optionalUsuario = usuarioService.buscarPorUsername(username);

        if(optionalUsuario.isPresent()) {
            Usuario usuario = optionalUsuario.get();

            // Verificar contraseña y rol
            if(passwordEncoder.matches(clave, usuario.getPassword()) && usuario.getRol().equalsIgnoreCase(rol)) {
                session.setAttribute("rol", usuario.getRol());
                session.setAttribute("usuario", usuario.getUsername());
                resp.put("ok", true);
                return resp;
            }
        }

        resp.put("ok", false);
        resp.put("mensaje", "Credenciales incorrectas");
        return resp;
    }

    @GetMapping("/logout")
    public void logout(HttpSession session) {
        session.invalidate();
    }
}
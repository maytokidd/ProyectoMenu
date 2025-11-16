package com.cafeteria.MenuVersiones.controladores;

import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.*;

@RestController
public class LoginController {

    @PostMapping("/login-validar")
    public Map<String, Object> validar(@RequestBody Map<String, String> datos, HttpSession session) {

        String usuario = datos.get("usuario");
        String clave = datos.get("clave");
        String rol = datos.get("rol");

        Map<String, Object> resp = new HashMap<>();

        if (usuario.equals("admin") && clave.equals("123") && rol.equals("ADMIN")) {
            session.setAttribute("rol", "ADMIN");
            resp.put("ok", true);
            return resp;
        }

        if (usuario.equals("user") && clave.equals("123") && rol.equals("USER")) {
            session.setAttribute("rol", "USER");
            resp.put("ok", true);
            return resp;
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

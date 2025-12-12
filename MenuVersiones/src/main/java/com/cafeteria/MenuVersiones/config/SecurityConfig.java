package com.cafeteria.MenuVersiones.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

@Configuration
public class SecurityConfig {

    // Bean para encriptar contraseñas
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configuración de seguridad
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            // 🔓 CSRF deshabilitado (como ya lo tenías)
            .csrf(csrf -> csrf.disable())

            // 🔓 Permitir todas las rutas (tu sistema usa filtros propios)
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())

            // ✅ CONFIGURACIÓN CORRECTA DE LOGOUT
            .logout(logout -> logout
                .logoutUrl("/logout")           // URL del botón "Cerrar Sesión"
                .logoutSuccessUrl("/login.html")          // 🔁 REDIRECCIÓN CORRECTA (login)
                .invalidateHttpSession(true)    // ❌ Elimina sesión
                .clearAuthentication(true)      // ❌ Limpia autenticación
                .deleteCookies("JSESSIONID")    // ❌ Borra cookie
            );

        return http.build();
    }
}

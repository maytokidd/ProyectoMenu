package com.cafeteria.MenuVersiones.config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerarPassword {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "1234"; // La contraseña que quieres usar
        String encodedPassword = encoder.encode(password);
        System.out.println("Contraseña encriptada: " + encodedPassword);
    }
}
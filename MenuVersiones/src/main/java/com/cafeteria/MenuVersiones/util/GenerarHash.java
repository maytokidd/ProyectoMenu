package com.cafeteria.MenuVersiones.util;  // <- Debe coincidir con la ruta de la carpeta

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerarHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String hashAdmin = encoder.encode("123456"); // Contraseña de admin
        String hashUser = encoder.encode("123");     // Contraseña de user

        System.out.println("Hash admin: " + hashAdmin);
        System.out.println("Hash user: " + hashUser);
    }
}
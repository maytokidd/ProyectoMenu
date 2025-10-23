package com.cafeteria.MenuVersiones.clases;

/**
 * Data Transfer Object (DTO) para recibir las credenciales 
 * del formulario de login.js.
 */
public class LoginRequest {
    
    private String username;
    private String password;
    private String rol;

    // Getters y Setters 
    
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}
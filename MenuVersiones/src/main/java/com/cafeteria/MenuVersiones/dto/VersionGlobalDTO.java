package com.cafeteria.MenuVersiones.dto;

import java.time.LocalDateTime;

public class VersionGlobalDTO {

    private String menuNombre;
    private LocalDateTime fechaCambio;
    private String usuario;

    public VersionGlobalDTO(String menuNombre, LocalDateTime fechaCambio, String usuario) {
        this.menuNombre = menuNombre;
        this.fechaCambio = fechaCambio;
        this.usuario = usuario;
    }

    public String getMenuNombre() { return menuNombre; }
    public LocalDateTime getFechaCambio() { return fechaCambio; }
    public String getUsuario() { return usuario; }
}

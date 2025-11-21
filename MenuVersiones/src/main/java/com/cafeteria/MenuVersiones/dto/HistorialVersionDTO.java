package com.cafeteria.MenuVersiones.dto;

import java.time.LocalDateTime;

public class HistorialVersionDTO {

    private String menuNombre;
    private LocalDateTime fechaCambio;
    private String usuario;
    private String motivo;

    public HistorialVersionDTO(String menuNombre, LocalDateTime fechaCambio,
                               String usuario, String motivo) {
        this.menuNombre = menuNombre;
        this.fechaCambio = fechaCambio;
        this.usuario = usuario;
        this.motivo = motivo;
    }

    public String getMenuNombre() {
        return menuNombre;
    }

    public void setMenuNombre(String menuNombre) {
        this.menuNombre = menuNombre;
    }

    public LocalDateTime getFechaCambio() {
        return fechaCambio;
    }

    public void setFechaCambio(LocalDateTime fechaCambio) {
        this.fechaCambio = fechaCambio;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getMotivo() {
        return motivo;
    }

    public void setMotivo(String motivo) {
        this.motivo = motivo;
    }
}

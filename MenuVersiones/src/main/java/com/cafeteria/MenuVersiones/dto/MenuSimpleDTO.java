package com.cafeteria.MenuVersiones.dto;

import java.time.LocalDateTime;

public class MenuSimpleDTO {

    private Long id;
    private String nombre;
    private String categoria;
    private Double precio;
    private Boolean disponible;
    private Integer stock; 
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimaModificacion;
    private String responsable;

    public MenuSimpleDTO(
            Long id,
            String nombre,
            String categoria,
            Double precio,
            Boolean disponible,
            Integer stock,
            LocalDateTime fechaCreacion,
            LocalDateTime ultimaModificacion,
            String responsable
    ) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.disponible = disponible;
        this.stock = stock;
        this.fechaCreacion = fechaCreacion;
        this.ultimaModificacion = ultimaModificacion;
        this.responsable = responsable;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getCategoria() { return categoria; }
    public Double getPrecio() { return precio; }
    public Boolean getDisponible() { return disponible; }
    public Integer getStock() { return stock; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public LocalDateTime getUltimaModificacion() { return ultimaModificacion; }
    public String getResponsable() { return responsable; }
}

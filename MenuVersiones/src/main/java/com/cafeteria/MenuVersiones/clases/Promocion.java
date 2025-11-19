package com.cafeteria.MenuVersiones.clases;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "promociones")
public class Promocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private Double descuentoPorcentaje; // Ej: 0.15 (para 15%)

    @Column(nullable = false)
    private LocalDate fechaInicio; 

    @Column(nullable = false)
    private LocalDate fechaFin; 
    
    @Column(nullable = false)
    private Boolean activo = true;

    // Constructor vacío (obligatorio)
    public Promocion() {}

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Double getDescuentoPorcentaje() { return descuentoPorcentaje; }
    public void setDescuentoPorcentaje(Double descuentoPorcentaje) { this.descuentoPorcentaje = descuentoPorcentaje; }
    public LocalDate getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDate fechaInicio) { this.fechaInicio = fechaInicio; }
    public LocalDate getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDate fechaFin) { this.fechaFin = fechaFin; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
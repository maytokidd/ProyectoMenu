package com.cafeteria.MenuVersiones.clases;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "menus")
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre del plato
    @Column(nullable = false)
    private String nombre;

    // Categoría (Entrada, Fondo, Postre...)
    @Column(nullable = false)
    private String categoria;

    // Precio
    @Column(nullable = false)
    private Double precio;

    // Stock disponible del producto
    @Column
    private Integer stock = 0;

    // Si está disponible o no
    @Column(nullable = false)
    private Boolean disponible = true;

    // Fecha de creación del menú
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    // Fecha de última modificación
    private LocalDateTime ultimaModificacion = LocalDateTime.now();

    // Responsable que hizo el último cambio (puede cambiarlo luego)
    private String responsable = "Administrador";

    // Relación con versiones
    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Version> versiones;

    public Menu() {}

    // ===== GETTERS Y SETTERS =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }

    public LocalDateTime getUltimaModificacion() { return ultimaModificacion; }
    public void setUltimaModificacion(LocalDateTime ultimaModificacion) { this.ultimaModificacion = ultimaModificacion; }

    public String getResponsable() { return responsable; }
    public void setResponsable(String responsable) { this.responsable = responsable; }

    public List<Version> getVersiones() { return versiones; }
    public void setVersiones(List<Version> versiones) { this.versiones = versiones; }
}

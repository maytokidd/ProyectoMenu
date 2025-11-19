package com.cafeteria.MenuVersiones.clases;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ventas")
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long menuId;
    private String menuNombre;

    private double precioUnitario;
    private int cantidad;
    private double total;

    private String empleado;       // nombre o usuario del empleado

    private LocalDateTime fechaVenta = LocalDateTime.now();

    // ===== Getters y Setters =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMenuId() { return menuId; }
    public void setMenuId(Long menuId) { this.menuId = menuId; }

    public String getMenuNombre() { return menuNombre; }
    public void setMenuNombre(String menuNombre) { this.menuNombre = menuNombre; }

    public double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(double precioUnitario) { this.precioUnitario = precioUnitario; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public String getEmpleado() { return empleado; }
    public void setEmpleado(String empleado) { this.empleado = empleado; }

    public LocalDateTime getFechaVenta() { return fechaVenta; }
    public void setFechaVenta(LocalDateTime fechaVenta) { this.fechaVenta = fechaVenta; }
}

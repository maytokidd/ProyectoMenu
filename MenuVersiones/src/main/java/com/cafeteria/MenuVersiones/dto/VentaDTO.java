package com.cafeteria.MenuVersiones.dto;

public class VentaDTO {

    private Long id;
    private String fechaVenta;
    private String empleado;  // nombre real
    private String menuNombre;
    private int cantidad;
    private double precioUnitario;
    private double total;
    private String codigoCliente;
    private String nombreCliente;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFechaVenta() { return fechaVenta; }
    public void setFechaVenta(String fechaVenta) { this.fechaVenta = fechaVenta; }

    public String getEmpleado() { return empleado; }
    public void setEmpleado(String empleado) { this.empleado = empleado; }

    public String getMenuNombre() { return menuNombre; }
    public void setMenuNombre(String menuNombre) { this.menuNombre = menuNombre; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(double precioUnitario) { this.precioUnitario = precioUnitario; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public String getCodigoCliente() { return codigoCliente; }
    public void setCodigoCliente(String codigoCliente) { this.codigoCliente = codigoCliente; }

    public String getNombreCliente() { return nombreCliente; }
    public void setNombreCliente(String nombreCliente) { this.nombreCliente = nombreCliente; }
}

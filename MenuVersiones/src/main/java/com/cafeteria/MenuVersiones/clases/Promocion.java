package com.cafeteria.MenuVersiones.clases;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "promociones")
public class Promocion {

    // ===========================================
    // ID
    // ===========================================
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===========================================
    // INFORMACIÓN GENERAL
    // ===========================================
    private String titulo;

    @Column(length = 500)
    private String descripcion;

    /**
     * precioOferta = PRECIO FINAL de la promoción (después del descuento)
     * Ejemplo:
     *  precioRealTotal = 26.00
     *  descuento = 10
     *  precioOferta = 23.40
     */
    @Column(name = "precio_oferta")
    private Double precioOferta;

    /**
     * Porcentaje de descuento aplicado a la suma original
     * Ejemplo: 10 → 10%
     */
    private Integer descuento;

    /**
     * Suma de precios ORIGINALES de todos los ítems del combo
     */
    @Column(name = "precio_real_total")
    private Double precioRealTotal;

    // ===========================================
    // FECHAS
    // ===========================================
    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    // Estado manual almacenado
    private String activa;

    // ===========================================
    // ÍTEMS DEL COMBO (FK)
    // ===========================================
    @Column(name = "plato_fondo_id")
    private Long platoFondoId;

    @Column(name = "entrada_id")
    private Long entradaId;

    @Column(name = "postre_id")
    private Long postreId;

    @Column(name = "bebida_id")
    private Long bebidaId;

    // ===========================================
    // STOCK
    // ===========================================
    @Column(name = "stock_maximo")
    private Integer stockMaximo;

    // ===========================================
    // FECHA DE CREACIÓN (AUTOMÁTICA)
    // ===========================================
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }

    // ===========================================
    // CONSTRUCTOR VACÍO
    // ===========================================
    public Promocion() {
    }

    // ===========================================
    // GETTERS Y SETTERS
    // ===========================================

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Double getPrecioOferta() { return precioOferta; }
    public void setPrecioOferta(Double precioOferta) { this.precioOferta = precioOferta; }

    public Integer getDescuento() { return descuento; }
    public void setDescuento(Integer descuento) { this.descuento = descuento; }

    public Double getPrecioRealTotal() { return precioRealTotal; }
    public void setPrecioRealTotal(Double precioRealTotal) { this.precioRealTotal = precioRealTotal; }

    public LocalDateTime getFechaInicio() { return fechaInicio; }
    public void setFechaInicio(LocalDateTime fechaInicio) { this.fechaInicio = fechaInicio; }

    public LocalDateTime getFechaFin() { return fechaFin; }
    public void setFechaFin(LocalDateTime fechaFin) { this.fechaFin = fechaFin; }

    public String getActiva() { return activa; }
    public void setActiva(String activa) { this.activa = activa; }

    public Long getPlatoFondoId() { return platoFondoId; }
    public void setPlatoFondoId(Long platoFondoId) { this.platoFondoId = platoFondoId; }

    public Long getEntradaId() { return entradaId; }
    public void setEntradaId(Long entradaId) { this.entradaId = entradaId; }

    public Long getPostreId() { return postreId; }
    public void setPostreId(Long postreId) { this.postreId = postreId; }

    public Long getBebidaId() { return bebidaId; }
    public void setBebidaId(Long bebidaId) { this.bebidaId = bebidaId; }

    public Integer getStockMaximo() { return stockMaximo; }
    public void setStockMaximo(Integer stockMaximo) { this.stockMaximo = stockMaximo; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}

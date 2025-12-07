package com.cafeteria.MenuVersiones.clases;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "promociones")
public class Promocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(length = 500)
    private String descripcion;

    @Column(name = "precio_oferta")
    private Double precioOferta; // precio final con descuento

    // nuevo: porcentaje de descuento aplicado (opcional)
    private Integer descuento;

    // precio real total (suma de los items del combo)
    @Column(name = "precio_real_total")
    private Double precioRealTotal;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    private String activa; // "Activa", "Programada", "Inactiva"

    // mantenemos menuId por compatibilidad (si alguna parte antigua lo usa)
    // @Column(name = "menu_id")
    // private Long menuId;

    @Column(name = "menu_id", nullable = true) // <-- ¡Aseguramos que es opcional en JPA!
    private Long menuId;

    // NUEVOS campos: IDs por tipo (nullable)
    @Column(name = "plato_fondo_id")
    private Long platoFondoId;

    @Column(name = "entrada_id")
    private Long entradaId;

    @Column(name = "postre_id")
    private Long postreId;

    @Column(name = "bebida_id")
    private Long bebidaId;

    // stock máximo del combo (mínimo entre items)
    @Column(name = "stock_maximo")
    private Integer stockMaximo;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    // ===== GETTERS Y SETTERS =====

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

    public Long getMenuId() { return menuId; }
    public void setMenuId(Long menuId) { this.menuId = menuId; }

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
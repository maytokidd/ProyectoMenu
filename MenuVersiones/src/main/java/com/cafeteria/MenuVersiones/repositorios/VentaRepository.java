package com.cafeteria.MenuVersiones.repositorios;

import com.cafeteria.MenuVersiones.clases.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VentaRepository extends JpaRepository<Venta, Long> {

    // Monto total vendido HOY (para Dashboard y Ventas)
    @Query("SELECT SUM(v.total) FROM Venta v WHERE DATE(v.fechaVenta) = CURRENT_DATE")
    Double ventasDelDia();
}

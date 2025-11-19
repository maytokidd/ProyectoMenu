package com.cafeteria.MenuVersiones.controladores;

import com.cafeteria.MenuVersiones.clases.Venta;
import com.cafeteria.MenuVersiones.repositorios.VentaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin("*")
public class VentaController {

    private final VentaRepository ventaRepository;

    public VentaController(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    // Listar todas las ventas (la usarás en ventas_admin.js)
    @GetMapping
    public List<Venta> listarVentas() {
        return ventaRepository.findAll();
    }

    // Registrar venta (la usará tu compañero desde el módulo de usuarios)
    @PostMapping
    public Venta registrarVenta(@RequestBody Venta venta) {

        // Calcula total por seguridad, por si el front se equivoca
        double total = venta.getPrecioUnitario() * venta.getCantidad();
        venta.setTotal(total);

        return ventaRepository.save(venta);
    }

    // Monto total de ventas del día (Dashboard + tarjeta en ventas)
    @GetMapping("/del-dia")
    public Double ventasDelDia() {
        Double monto = ventaRepository.ventasDelDia();
        return (monto != null) ? monto : 0.0;
    }
}

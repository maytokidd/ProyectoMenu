package com.cafeteria.MenuVersiones.controladores;

import com.cafeteria.MenuVersiones.clases.Promocion;
import com.cafeteria.MenuVersiones.servicios.PromocionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/promociones") // Se ajusta al JS
@CrossOrigin(origins = "*")
public class PromocionController {

    private final PromocionService promocionService;

    public PromocionController(PromocionService promocionService) {
        this.promocionService = promocionService;
    }

    // Listar todas las promociones
    @GetMapping
    public List<Promocion> listar() {
        return promocionService.listar();
    }

    // Obtener una promoción por ID
    @GetMapping("/{id}")
    public Promocion obtenerPorId(@PathVariable Long id) {
        Optional<Promocion> promoOpt = promocionService.buscarPorId(id);
        return promoOpt.orElse(null);
    }

    // Crear nueva promoción
    @PostMapping
    public Promocion crear(@RequestBody Promocion promo) {
        return promocionService.crear(promo);
    }

    // Actualizar promoción existente
    @PutMapping("/{id}")
    public Promocion actualizar(@PathVariable Long id, @RequestBody Promocion promo) {
        promo.setId(id);
        return promocionService.actualizar(promo);
    }

    // Eliminar promoción
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        promocionService.eliminar(id);
    }
}
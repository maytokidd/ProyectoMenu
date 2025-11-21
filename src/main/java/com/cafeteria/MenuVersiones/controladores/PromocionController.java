package com.cafeteria.MenuVersiones.controladores;

import com.cafeteria.MenuVersiones.clases.Promocion;
import com.cafeteria.MenuVersiones.servicios.PromocionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/promociones") // Solo rutas para usuarios
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
}
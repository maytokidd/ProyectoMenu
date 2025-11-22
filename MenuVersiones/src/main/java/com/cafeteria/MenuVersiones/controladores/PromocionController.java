package com.cafeteria.MenuVersiones.controladores;

import com.cafeteria.MenuVersiones.clases.Promocion;
import com.cafeteria.MenuVersiones.service.PromocionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/promociones")
@CrossOrigin(origins = "*") // Para permitir llamadas desde tu frontend
public class PromocionController {

    @Autowired
    private PromocionService promocionService;

    // Listar todas o filtrar activas
    @GetMapping
    public List<Promocion> listar(@RequestParam(value = "activas", required = false) Boolean activas) {
        if (activas != null && activas) {
            return promocionService.listarPorEstado("Activa");
        }
        return promocionService.listarTodas();
    }

    // Obtener por ID
    @GetMapping("/{id}")
    public Optional<Promocion> obtener(@PathVariable Long id) {
        return promocionService.obtenerPorId(id);
    }

    // Crear nueva
    @PostMapping
    public Promocion crear(@RequestBody Promocion promocion) {
        return promocionService.guardar(promocion);
    }

    // Editar existente
    @PutMapping("/{id}")
    public Promocion actualizar(@PathVariable Long id, @RequestBody Promocion promocion) {
        promocion.setId(id);
        return promocionService.guardar(promocion);
    }

    // Eliminar
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        promocionService.eliminar(id);
    }
}
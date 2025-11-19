package com.cafeteria.MenuVersiones.controladores;

import com.cafeteria.MenuVersiones.clases.Promocion;
import com.cafeteria.MenuVersiones.repositorios.PromocionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/promociones") // Endpoint: /api/promociones
@CrossOrigin(origins = "*") 
public class PromocionController {

    @Autowired
    private PromocionRepository promocionRepository;

    // OBTENER TODAS (READ)
    @GetMapping
    public List<Promocion> getAllPromociones() {
        return promocionRepository.findAll();
    }

    // CREAR UNA NUEVA (CREATE)
    @PostMapping
    public ResponseEntity<Promocion> createPromocion(@RequestBody Promocion nuevaPromocion) {
        Promocion promocionGuardada = promocionRepository.save(nuevaPromocion);
        return ResponseEntity.ok(promocionGuardada);
    }

    // OBTENER POR ID
    @GetMapping("/{id}")
    public ResponseEntity<Promocion> getPromocionById(@PathVariable Long id) {
        return promocionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    //ACTUALIZAR POR ID (UPDATE)
    @PutMapping("/{id}")
    public ResponseEntity<Promocion> updatePromocion(@PathVariable Long id, @RequestBody Promocion detallesPromocion) {
        Optional<Promocion> promocionOpt = promocionRepository.findById(id);

        if (promocionOpt.isPresent()) {
            Promocion promocionExistente = promocionOpt.get();
            
            promocionExistente.setNombre(detallesPromocion.getNombre());
            promocionExistente.setDescripcion(detallesPromocion.getDescripcion());
            promocionExistente.setDescuentoPorcentaje(detallesPromocion.getDescuentoPorcentaje());
            promocionExistente.setFechaInicio(detallesPromocion.getFechaInicio());
            promocionExistente.setFechaFin(detallesPromocion.getFechaFin());
            promocionExistente.setActivo(detallesPromocion.getActivo());
            
            return ResponseEntity.ok(promocionRepository.save(promocionExistente));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ELIMINAR POR ID (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromocion(@PathVariable Long id) {
        if (promocionRepository.existsById(id)) {
            promocionRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
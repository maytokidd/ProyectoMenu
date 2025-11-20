package com.cafeteria.MenuVersiones.controladores;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.cafeteria.MenuVersiones.clases.Promocion;
import com.cafeteria.MenuVersiones.repositorios.PromocionRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/promociones")
@CrossOrigin(origins = "*")
public class AdminPromocionController {

    @Autowired
    private PromocionRepository promocionRepo;

    @GetMapping
    public List<Promocion> listar() { return promocionRepo.findAll(); }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        Optional<Promocion> p = promocionRepo.findById(id);
        return p.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Promocion p) {
        Promocion saved = promocionRepo.save(p);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody Promocion data) {
        Optional<Promocion> p = promocionRepo.findById(id);
        if (p.isEmpty()) return ResponseEntity.notFound().build();
        Promocion exist = p.get();
        exist.setTitulo(data.getTitulo());
        exist.setDescripcion(data.getDescripcion());
        exist.setDescuento(data.getDescuento());
        exist.setFechaInicio(data.getFechaInicio());
        exist.setFechaFin(data.getFechaFin());
        exist.setActivo(data.getActivo());
        promocionRepo.save(exist);
        return ResponseEntity.ok(exist);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        promocionRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
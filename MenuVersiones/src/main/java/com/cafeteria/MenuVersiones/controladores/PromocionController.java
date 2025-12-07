package com.cafeteria.MenuVersiones.controladores;

import com.cafeteria.MenuVersiones.clases.Menu;
import com.cafeteria.MenuVersiones.clases.Promocion;
import com.cafeteria.MenuVersiones.repositorios.MenuRepository;
import com.cafeteria.MenuVersiones.service.PromocionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/promociones")
@CrossOrigin(origins = "*")
public class PromocionController {

    @Autowired
    private PromocionService promocionService;

    @Autowired
    private MenuRepository menuRepository;

    // LISTAR PROMOS
    @GetMapping
    public List<Promocion> listar(@RequestParam(value = "activas", required = false) Boolean activas) {
        if (activas != null && activas) {
            return promocionService.listarPorEstado("Activa");
        }
        return promocionService.listarTodas();
    }

    @GetMapping("/activas")
    public List<Promocion> promocionesActivas() {
        return promocionService.listarActivasVigentes();
    }

    @GetMapping("/{id}")
    public Optional<Promocion> obtener(@PathVariable Long id) {
        return Optional.ofNullable(promocionService.obtenerPorId(id));
    }

    // ===========================================
    // 🔥 GUARDAR PROMOCIÓN CON VALIDACIÓN DE STOCK
    // ===========================================
    @PostMapping
    public Promocion crear(@RequestBody Promocion p) {

        // 1️⃣ Calcular stock máximo permitido
        Integer stockPermitido = calcularStockCombo(p);

        if (p.getStockMaximo() > stockPermitido) {
            throw new RuntimeException("Stock inválido. El máximo permitido es: " + stockPermitido);
        }

        // 2️⃣ Calcular precio real total según los ítems
        Double total = calcularPrecioCombo(p);
        p.setPrecioRealTotal(total);

        return promocionService.guardar(p);
    }

    @PutMapping("/{id}")
    public Promocion actualizar(@PathVariable Long id, @RequestBody Promocion p) {

        p.setId(id);

        Integer stockPermitido = calcularStockCombo(p);

        if (p.getStockMaximo() > stockPermitido) {
            throw new RuntimeException("Stock inválido. El máximo permitido es: " + stockPermitido);
        }

        p.setPrecioRealTotal(calcularPrecioCombo(p));

        return promocionService.guardar(p);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        promocionService.eliminar(id);
    }

    // ===========================================
    // 🔥 FUNCIONES AUXILIARES
    // ===========================================

    private Integer calcularStockCombo(Promocion p) {

        List<Integer> stocks = new ArrayList<>();

        if (p.getPlatoFondoId() != null) {
            stocks.add(menuRepository.findById(p.getPlatoFondoId()).get().getStock());
        }
        if (p.getEntradaId() != null) {
            stocks.add(menuRepository.findById(p.getEntradaId()).get().getStock());
        }
        if (p.getPostreId() != null) {
            stocks.add(menuRepository.findById(p.getPostreId()).get().getStock());
        }
        if (p.getBebidaId() != null) {
            stocks.add(menuRepository.findById(p.getBebidaId()).get().getStock());
        }

        if (stocks.isEmpty()) return 0;

        return Collections.min(stocks);
    }

    private Double calcularPrecioCombo(Promocion p) {
        double total = 0;

        if (p.getPlatoFondoId() != null)
            total += menuRepository.findById(p.getPlatoFondoId()).get().getPrecio();

        if (p.getEntradaId() != null)
            total += menuRepository.findById(p.getEntradaId()).get().getPrecio();

        if (p.getPostreId() != null)
            total += menuRepository.findById(p.getPostreId()).get().getPrecio();

        if (p.getBebidaId() != null)
            total += menuRepository.findById(p.getBebidaId()).get().getPrecio();

        return total;
    }
}

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
    // GUARDAR PROMOCIÓN (OPCIÓN B: precioOferta = precio final)
    // ===========================================
    @PostMapping
    public Promocion crear(@RequestBody Promocion p) {

        // 1️⃣ Calcular stock máximo permitido
        Integer stockPermitido = calcularStockCombo(p);
        Integer stockMaximo = p.getStockMaximo() != null ? p.getStockMaximo() : 0;

        if (stockPermitido != null && stockPermitido > 0 && stockMaximo > stockPermitido) {
            throw new RuntimeException("Stock inválido. El máximo permitido es: " + stockPermitido);
        }

        // 2️⃣ Calcular precio real total según los ítems del combo
        Double total = calcularPrecioCombo(p);
        p.setPrecioRealTotal(total);

        // 3️⃣ Asegurar precioOferta como precio final
        Integer descuento = p.getDescuento();
        if (descuento != null && total != null) {
            double precioFinal = total * (1 - (descuento / 100.0));
            p.setPrecioOferta(redondear2Dec(precioFinal));
        } else if (p.getPrecioOferta() == null && total != null) {
            // si no viene descuento, pero sí total, usar total
            p.setPrecioOferta(redondear2Dec(total));
        }

        return promocionService.guardar(p);
    }

    @PutMapping("/{id}")
    public Promocion actualizar(@PathVariable Long id, @RequestBody Promocion p) {

        p.setId(id);

        Integer stockPermitido = calcularStockCombo(p);
        Integer stockMaximo = p.getStockMaximo() != null ? p.getStockMaximo() : 0;

        if (stockPermitido != null && stockPermitido > 0 && stockMaximo > stockPermitido) {
            throw new RuntimeException("Stock inválido. El máximo permitido es: " + stockPermitido);
        }

        Double total = calcularPrecioCombo(p);
        p.setPrecioRealTotal(total);

        Integer descuento = p.getDescuento();
        if (descuento != null && total != null) {
            double precioFinal = total * (1 - (descuento / 100.0));
            p.setPrecioOferta(redondear2Dec(precioFinal));
        } else if (p.getPrecioOferta() == null && total != null) {
            p.setPrecioOferta(redondear2Dec(total));
        }

        return promocionService.guardar(p);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        promocionService.eliminar(id);
    }

    // ===========================================
    // FUNCIONES AUXILIARES
    // ===========================================

    private Integer calcularStockCombo(Promocion p) {

        List<Integer> stocks = new ArrayList<>();

        if (p.getPlatoFondoId() != null) {
            menuRepository.findById(p.getPlatoFondoId())
                    .map(Menu::getStock)
                    .ifPresent(stocks::add);
        }
        if (p.getEntradaId() != null) {
            menuRepository.findById(p.getEntradaId())
                    .map(Menu::getStock)
                    .ifPresent(stocks::add);
        }
        if (p.getPostreId() != null) {
            menuRepository.findById(p.getPostreId())
                    .map(Menu::getStock)
                    .ifPresent(stocks::add);
        }
        if (p.getBebidaId() != null) {
            menuRepository.findById(p.getBebidaId())
                    .map(Menu::getStock)
                    .ifPresent(stocks::add);
        }

        if (stocks.isEmpty()) return 0;

        return Collections.min(stocks);
    }

    private Double calcularPrecioCombo(Promocion p) {
        double total = 0;

        if (p.getPlatoFondoId() != null) {
            total += menuRepository.findById(p.getPlatoFondoId())
                    .map(Menu::getPrecio)
                    .orElse(0.0);
        }

        if (p.getEntradaId() != null) {
            total += menuRepository.findById(p.getEntradaId())
                    .map(Menu::getPrecio)
                    .orElse(0.0);
        }

        if (p.getPostreId() != null) {
            total += menuRepository.findById(p.getPostreId())
                    .map(Menu::getPrecio)
                    .orElse(0.0);
        }

        if (p.getBebidaId() != null) {
            total += menuRepository.findById(p.getBebidaId())
                    .map(Menu::getPrecio)
                    .orElse(0.0);
        }

        return total;
    }

    private double redondear2Dec(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}

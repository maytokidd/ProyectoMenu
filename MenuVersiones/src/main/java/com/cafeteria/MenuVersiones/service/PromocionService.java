package com.cafeteria.MenuVersiones.service;

import com.cafeteria.MenuVersiones.clases.Promocion;
import com.cafeteria.MenuVersiones.repositorios.PromocionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PromocionService {

    @Autowired
    private PromocionRepository promocionRepository;

    public List<Promocion> listarTodas() {
        return promocionRepository.findAll();
    }

    public List<Promocion> listarPorEstado(String estado) {
        return promocionRepository.findByActivaIgnoreCase(estado);
    }

    // ⭐ MÉTODO CLAVE → devuelve solo promociones activas y vigentes HOY
   public List<Promocion> listarActivasVigentes() {
    LocalDate hoy = LocalDate.now();

    return promocionRepository.findAll().stream()
            .filter(p -> {

                // Validar nulls sin romper el filtro
                if (p.getActiva() == null || p.getFechaInicio() == null || p.getFechaFin() == null) {
                    return false;
                }

                boolean activa = p.getActiva().equalsIgnoreCase("activa");
                boolean inicia = !p.getFechaInicio().toLocalDate().isAfter(hoy);
                boolean termina = !p.getFechaFin().toLocalDate().isBefore(hoy);

                return activa && inicia && termina;
            })
            .toList();
}


    public Promocion obtenerPorId(Long id) {
        Optional<Promocion> promo = promocionRepository.findById(id);
        return promo.orElse(null);
    }

    public Promocion guardar(Promocion promocion) {
        return promocionRepository.save(promocion);
    }

    public void eliminar(Long id) {
        promocionRepository.deleteById(id);
    }
}

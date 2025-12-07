package com.cafeteria.MenuVersiones.service;

import com.cafeteria.MenuVersiones.clases.Promocion;
import com.cafeteria.MenuVersiones.repositorios.PromocionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

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

    // NUEVO: devuelve solo promociones activas y vigentes
    public List<Promocion> listarActivasVigentes() {
        LocalDate hoy = LocalDate.now();

        return promocionRepository.findByActivaIgnoreCase("Activa").stream()
                .filter(p -> p.getFechaInicio() != null)
                .filter(p -> p.getFechaFin() != null)
                .filter(p -> !p.getFechaInicio().toLocalDate().isAfter(hoy))  // fecha_inicio <= hoy
                .filter(p -> !p.getFechaFin().toLocalDate().isBefore(hoy))    // fecha_fin >= hoy
                .toList();
    }

    public Promocion guardar(Promocion promocion) {
        return promocionRepository.save(promocion);
    }

    public void eliminar(Long id) {
        promocionRepository.deleteById(id);
    }

    public Promocion obtenerPorId(Long id) {
        return promocionRepository.findById(id).orElse(null);
    }
}

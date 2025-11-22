package com.cafeteria.MenuVersiones.service;

import com.cafeteria.MenuVersiones.clases.Promocion;
import com.cafeteria.MenuVersiones.repositorios.PromocionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        return promocionRepository.findByActiva(estado);
    }

    public Optional<Promocion> obtenerPorId(Long id) {
        return promocionRepository.findById(id);
    }

    public Promocion guardar(Promocion promocion) {
        return promocionRepository.save(promocion);
    }

    public void eliminar(Long id) {
        promocionRepository.deleteById(id);
    }
}
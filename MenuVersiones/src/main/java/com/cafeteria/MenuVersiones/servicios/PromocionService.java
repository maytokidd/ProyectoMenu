package com.cafeteria.MenuVersiones.servicios;

import com.cafeteria.MenuVersiones.clases.Promocion;
import com.cafeteria.MenuVersiones.repositorios.PromocionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PromocionService {

    private final PromocionRepository promocionRepository;

    public PromocionService(PromocionRepository promocionRepository) {
        this.promocionRepository = promocionRepository;
    }

    public Promocion crear(Promocion promo) {
        return promocionRepository.save(promo);
    }

    public List<Promocion> listar() {
        return promocionRepository.findAll();
    }

    public Optional<Promocion> buscarPorId(Long id) {
        return promocionRepository.findById(id);
    }

    public Promocion actualizar(Promocion promo) {
        return promocionRepository.save(promo);
    }

    public void eliminar(Long id) {
        promocionRepository.deleteById(id);
    }
}
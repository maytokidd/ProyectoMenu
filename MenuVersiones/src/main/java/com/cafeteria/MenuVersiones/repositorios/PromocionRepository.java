package com.cafeteria.MenuVersiones.repositorios;

import com.cafeteria.MenuVersiones.clases.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Long> {
    List<Promocion> findByActiva(String activa); // Filtrar por estado "Activa", "Programada", "Inactiva"
}
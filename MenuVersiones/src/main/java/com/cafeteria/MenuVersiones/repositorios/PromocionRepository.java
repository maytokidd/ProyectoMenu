package com.cafeteria.MenuVersiones.repositorios;

import com.cafeteria.MenuVersiones.clases.Promocion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Long> {
    // Hereda los métodos CRUD
}
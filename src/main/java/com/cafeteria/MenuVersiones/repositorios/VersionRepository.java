package com.cafeteria.MenuVersiones.repositorios;

import com.cafeteria.MenuVersiones.clases.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VersionRepository extends JpaRepository<Version, Long> {
}
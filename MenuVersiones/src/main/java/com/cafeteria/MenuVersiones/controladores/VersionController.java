package com.cafeteria.MenuVersiones.controladores;

import com.cafeteria.MenuVersiones.clases.Version;
import com.cafeteria.MenuVersiones.dto.HistorialVersionDTO;
import com.cafeteria.MenuVersiones.repositorios.VersionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/versiones")
@CrossOrigin("*")
public class VersionController {

    private final VersionRepository versionRepository;

    public VersionController(VersionRepository versionRepository) {
        this.versionRepository = versionRepository;
    }

    // ============================================================
    // HISTORIAL GLOBAL (TODOS LOS MENÚS)
    // ============================================================
    @GetMapping("/historial")
    public List<HistorialVersionDTO> historialGlobal() {
        List<Version> versiones = versionRepository.findAll();

        return versiones.stream()
                .map(v -> new HistorialVersionDTO(
                        v.getMenu() != null ? v.getMenu().getNombre() : "(sin menú)",
                        v.getFechaCambio(),
                        v.getUsuario(),
                        v.getMotivo()
                ))
                .collect(Collectors.toList());
    }
    
}

package com.cafeteria.MenuVersiones.controladores;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cafeteria.MenuVersiones.clases.Menu;
import com.cafeteria.MenuVersiones.clases.Version;
import com.cafeteria.MenuVersiones.dto.MenuDTO;
import com.cafeteria.MenuVersiones.dto.MenuSimpleDTO;
import com.cafeteria.MenuVersiones.repositorios.MenuRepository;
import com.cafeteria.MenuVersiones.repositorios.VersionRepository;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/menus")
@CrossOrigin("*")
public class MenuController {

    private final MenuRepository menuRepository;
    private final VersionRepository versionRepository;

    public MenuController(MenuRepository menuRepository, VersionRepository versionRepository) {
        this.menuRepository = menuRepository;
        this.versionRepository = versionRepository;
    }

    // ============================================================
    // LISTAR TODOS LOS MENÚS (YA INCLUYE STOCK)
    // ============================================================
    @GetMapping
    public List<MenuSimpleDTO> getAllMenus() {
        return menuRepository.findAll()
                .stream()
                .map(m -> new MenuSimpleDTO(
                        m.getId(),
                        m.getNombre(),
                        m.getCategoria(),
                        m.getPrecio(),
                        m.getDisponible(),
                        m.getStock(), // ← IMPORTANTE: STOCK INCLUIDO
                        m.getFechaCreacion(),
                        m.getUltimaModificacion(),
                        m.getResponsable()
                ))
                .toList();
    }

    // ============================================================
    // OBTENER UN MENÚ POR ID
    // ============================================================
    @GetMapping("/{id}")
    public Menu getMenuById(@PathVariable Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menú no encontrado"));
    }

    // ============================================================
    // CREAR MENÚ + REGISTRAR HISTORIAL
    // ============================================================
    @PostMapping
    public ResponseEntity<?> crearMenu(@RequestBody MenuDTO data) {

        Menu menu = new Menu();
        menu.setNombre(data.getNombre());
        menu.setCategoria(data.getCategoria());
        menu.setPrecio(data.getPrecio());
        menu.setDisponible(data.getDisponible());
        menu.setStock(0); // por defecto si no lo envían
        menu.setFechaCreacion(LocalDateTime.now());
        menu.setUltimaModificacion(LocalDateTime.now());
        menu.setResponsable("Administrador");

        Menu saved = menuRepository.save(menu);

        // Registrar historial
        Version v = new Version();
        v.setMenu(saved);
        v.setUsuario("Administrador");
        v.setMotivo(data.getMotivo());
        v.setFechaCambio(LocalDateTime.now());
        versionRepository.save(v);

        return ResponseEntity.ok(saved);
    }

    // ============================================================
    // ACTUALIZAR MENÚ + REGISTRAR HISTORIAL
    // ============================================================
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarMenu(@PathVariable Long id, @RequestBody MenuDTO data) {

        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menú no encontrado"));

        menu.setNombre(data.getNombre());
        menu.setCategoria(data.getCategoria());
        menu.setPrecio(data.getPrecio());
        menu.setDisponible(data.getDisponible());
        menu.setUltimaModificacion(LocalDateTime.now());
        menu.setResponsable("Administrador");

        menuRepository.save(menu);

        // Historial
        Version v = new Version();
        v.setMenu(menu);
        v.setUsuario("Administrador");
        v.setMotivo(data.getMotivo());
        v.setFechaCambio(LocalDateTime.now());
        versionRepository.save(v);

        return ResponseEntity.ok(menu);
    }

    // ============================================================
    // ELIMINAR MENÚ
    // ============================================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarMenu(@PathVariable Long id) {
        menuRepository.deleteById(id);
        return ResponseEntity.ok("Menú eliminado");
    }

    // ============================================================
    // HISTORIAL POR MENÚ
    // ============================================================
    @GetMapping("/{id}/versiones")
    public List<Version> getVersiones(@PathVariable Long id) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menú no encontrado"));
        return menu.getVersiones();
    }

    // ============================================================
    // HISTORIAL GLOBAL
    // ============================================================
    @GetMapping("/historial")
    public List<Map<String, Object>> historialGlobal() {

        List<Version> versiones = versionRepository.findAll();
        List<Map<String, Object>> resultado = new ArrayList<>();

        for (Version v : versiones) {
            Map<String, Object> fila = new HashMap<>();
            fila.put("menuNombre", v.getMenu().getNombre());
            fila.put("fechaCambio", v.getFechaCambio());
            fila.put("usuario", v.getUsuario());
            resultado.add(fila);
        }

        return resultado;
    }
}

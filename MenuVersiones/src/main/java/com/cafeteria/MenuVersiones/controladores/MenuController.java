package com.cafeteria.MenuVersiones.controladores;

import org.springframework.web.bind.annotation.*;

import com.cafeteria.MenuVersiones.clases.Menu;
import com.cafeteria.MenuVersiones.repositorios.MenuRepository;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/menus")
public class MenuController {

    private final MenuRepository menuRepository;

    public MenuController(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    // Obtener todos los menús
    @GetMapping
    public List<Menu> getAllMenus() {
        return menuRepository.findAll();
    }

    // Obtener un menú por ID
    @GetMapping("/{id}")
    public Menu getMenuById(@PathVariable Long id) {
        return menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menú no encontrado"));
    }

    // Crear un nuevo menú
    @PostMapping
      public Menu createMenu(@RequestBody Menu menu) {
     menu.setFechaCreacion(LocalDateTime.now());
     return menuRepository.save(menu);
      }


    // Actualizar un menú existente
  @PutMapping("/{id}")
 public Menu updateMenu(@PathVariable Long id, @RequestBody Menu menuDetails) {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menú no encontrado"));

        menu.setNombre(menuDetails.getNombre());
        menu.setDescripcion(menuDetails.getDescripcion());
        menu.setPrecio(menuDetails.getPrecio());

        return menuRepository.save(menu);
    }

    // Eliminar un menú
    @DeleteMapping("/{id}")
    public void deleteMenu(@PathVariable Long id) {
        menuRepository.deleteById(id);
    }
}
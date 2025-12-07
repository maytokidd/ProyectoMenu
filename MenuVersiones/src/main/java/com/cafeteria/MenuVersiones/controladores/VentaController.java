package com.cafeteria.MenuVersiones.controladores;

import com.cafeteria.MenuVersiones.clases.Usuario;
import com.cafeteria.MenuVersiones.clases.Venta;
import com.cafeteria.MenuVersiones.dto.VentaDTO;
import com.cafeteria.MenuVersiones.repositorios.UsuarioRepository;
import com.cafeteria.MenuVersiones.repositorios.VentaRepository;

import jakarta.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin("*")
public class VentaController {

    private final VentaRepository ventaRepository;
    private final UsuarioRepository usuarioRepository;

    public VentaController(VentaRepository ventaRepository,
                           UsuarioRepository usuarioRepository) {
        this.ventaRepository = ventaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // ==========================================================
    // LISTAR TODAS LAS VENTAS → Devuelve VentaDTO
    // ==========================================================
    @GetMapping
public List<VentaDTO> listarVentas() {

    List<Venta> ventas = ventaRepository.findAll();
    List<VentaDTO> lista = new ArrayList<>();

    DateTimeFormatter formato = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    for (Venta v : ventas) {

        VentaDTO dto = new VentaDTO();

        dto.setId(v.getId());
        dto.setMenuNombre(v.getMenuNombre());
        dto.setCantidad(v.getCantidad());
        dto.setPrecioUnitario(v.getPrecioUnitario());
        dto.setTotal(v.getTotal());

        // Fecha formateada
        dto.setFechaVenta(v.getFechaVenta().format(formato));

        // Buscar nombre real del empleado
        Usuario usuario = usuarioRepository
                .findByUsername(v.getEmpleado())
                .orElse(null);

        if (usuario != null) {
            dto.setEmpleado(usuario.getNombre() + " " + usuario.getApellido());
        } else {
            dto.setEmpleado(v.getEmpleado());
        }

        lista.add(dto);
    }

    return lista;
}


    // ==========================================================
    // REGISTRAR UNA VENTA
    // ==========================================================
    @PostMapping
public Venta registrarVenta(@RequestBody Venta venta, HttpSession session) {

    // Recuperar usuario logueado en sesión
    String username = (String) session.getAttribute("usuario");

    if (username != null) {
        venta.setEmpleado(username);   // 🔥 guardar usuario real
    }

    // Calcular total
    double total = venta.getPrecioUnitario() * venta.getCantidad();
    venta.setTotal(total);

    return ventaRepository.save(venta);
}


    // ==========================================================
    // TOTAL VENDIDO DEL DÍA (PARA DASHBOARD Y VENTAS)
    // ==========================================================
    @GetMapping("/del-dia")
    public Double ventasDelDia() {
        Double monto = ventaRepository.ventasDelDia();
        return (monto != null) ? monto : 0.0;
    }
}

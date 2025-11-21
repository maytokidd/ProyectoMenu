package com.cafeteria.MenuVersiones;

import org.junit.jupiter.api.Test;

import com.cafeteria.MenuVersiones.clases.Producto;

import static org.junit.jupiter.api.Assertions.*;

public class ProductoTest {

    @Test
    public void testProductoToString() {
        Producto p = new Producto();
        p.setNombre("Café");
        p.setPrecio(5.50);

        String resultado = p.toString();

        assertTrue(resultado.contains("Café"));
        assertTrue(resultado.contains("5.5"));
    }
}
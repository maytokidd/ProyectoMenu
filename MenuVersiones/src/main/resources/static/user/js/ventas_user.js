document.addEventListener("DOMContentLoaded", async () => {

    // --- REFERENCIAS DOM ---
    const cantidadInput = document.getElementById("cantidad");
    const precioInput = document.getElementById("precio");
    const totalInput = document.getElementById("total");
    const productoSelect = document.getElementById("productoSelect");
    const tipoVentaSelect = document.getElementById("tipoVenta");
    const stockDisplay = document.getElementById("stockDisplay");
    const usuarioLogueadoInput = document.getElementById("usuarioLogueado");
    const preloadNotice = document.getElementById("preloadNotice");

    // --- VARIABLES DE DATOS ---
    let menus = [];
    let promociones = [];
    
    // --- INICIALIZACIÓN ---
    await obtenerUsuarioLogueado();
    await cargarDatosIniciales();
    cargarVentas(); // Cargar tabla de ventas realizadas

    // --- EVENTOS ---
    tipoVentaSelect.addEventListener("change", () => {
        actualizarListaProductos();
        // Al cambiar de tipo, seleccionamos el primero y actualizamos precios
        actualizarPrecioYTotal();
    });

    productoSelect.addEventListener("change", actualizarPrecioYTotal);
    
    cantidadInput.addEventListener("input", calcularTotal);
    
    document.getElementById("ventaForm").addEventListener("submit", (e) => {
        e.preventDefault();
        registrarVenta();
    });

    // ===========================================
    // 1. OBTENER USUARIO (CORREGIDO)
    // ===========================================
    async function obtenerUsuarioLogueado() {
        try {
            // Ruta corregida: /api/usuarios/mi-info (plural)
            const resp = await fetch("/api/usuarios/mi-info");
            
            if (resp.ok) {
                const data = await resp.json();
                if (data.username) {
                    usuarioLogueadoInput.value = data.username;
                    console.log("Usuario logueado:", data.username);
                } else {
                    console.warn("Sesión activa pero sin username.");
                }
            } else {
                console.error("No hay sesión activa o error en endpoint.");
            }
        } catch (e) {
            console.error("Error obteniendo usuario:", e);
        }
    }

    // ===========================================
    // 2. CARGAR MENÚS Y PROMOCIONES
    // ===========================================
    async function cargarDatosIniciales() {
        try {
            const [resMenus, resPromos] = await Promise.all([
                fetch("/api/menus"),
                fetch("/api/promociones/activas")
            ]);
            
            menus = await resMenus.json();
            promociones = await resPromos.json();

            // Filtrar menús solo disponibles para venta
            menus = menus.filter(m => m.disponible === true);

            // Verificar si venimos redirigidos desde Promociones
            const params = new URLSearchParams(window.location.search);
            const menuId = params.get('menuId');
            const tipo = params.get('tipo'); // 'PROMOCION' o null

            if (tipo === 'PROMOCION' && menuId) {
                tipoVentaSelect.value = "PROMOCION";
                actualizarListaProductos();
                productoSelect.value = menuId;
                
                // Mostrar aviso visual
                const item = promociones.find(p => p.id == menuId);
                if (item) {
                    preloadNotice.innerHTML = `🎁 Venta de promoción seleccionada: <strong>${item.titulo}</strong>`;
                    preloadNotice.style.display = "block";
                }
            } else if (menuId) {
                // Es un menú normal
                tipoVentaSelect.value = "MENU";
                actualizarListaProductos();
                productoSelect.value = menuId;
                
                const item = menus.find(m => m.id == menuId);
                if (item) {
                    preloadNotice.innerHTML = `🍽️ Venta de menú seleccionado: <strong>${item.nombre}</strong>`;
                    preloadNotice.style.display = "block";
                }
            } else {
                // Carga normal
                actualizarListaProductos();
            }

            // Forzar actualización de precios al cargar
            actualizarPrecioYTotal();

        } catch (err) {
            console.error("Error cargando datos iniciales:", err);
            alert("Error cargando productos. Revisa la consola.");
        }
    }

    // ===========================================
    // 3. ACTUALIZAR SELECT DE PRODUCTOS
    // ===========================================
    function actualizarListaProductos() {
        const tipo = tipoVentaSelect.value;
        let lista = (tipo === 'MENU') ? menus : promociones;

        productoSelect.innerHTML = "";
        
        if (lista.length === 0) {
            const option = document.createElement("option");
            option.textContent = "No hay elementos disponibles";
            productoSelect.appendChild(option);
            return;
        }

        lista.forEach(item => {
            const option = document.createElement("option");
            option.value = item.id;
            
            // Unificamos nombres de campos
            const nombre = item.nombre || item.titulo;
            const precio = item.precio || item.precioOferta;
            const stock = (item.stock !== undefined) ? item.stock : (item.stockMaximo !== undefined ? item.stockMaximo : 0);

            option.textContent = `${nombre} - S/ ${Number(precio).toFixed(2)}`;
            
            // Guardamos datos en dataset para acceso rápido
            option.dataset.precio = precio;
            option.dataset.stock = stock;
            
            productoSelect.appendChild(option);
        });
    }

    // ===========================================
    // 4. ACTUALIZAR PRECIO Y STOCK
    // ===========================================
    function actualizarPrecioYTotal() {
        const selected = productoSelect.selectedOptions[0];
        
        if (!selected || !selected.dataset.precio) {
            precioInput.value = "0.00";
            stockDisplay.textContent = "-";
            totalInput.value = "0.00";
            return;
        }

        const precio = Number(selected.dataset.precio);
        const stock = Number(selected.dataset.stock);

        precioInput.value = precio.toFixed(2);
        stockDisplay.textContent = stock;

        // Validar cantidad contra stock
        const cant = parseInt(cantidadInput.value) || 1;
        if (stock > 0 && cant > stock) {
            cantidadInput.value = stock;
        }
        
        // Estilizar stock si está bajo o agotado
        if (stock === 0) {
            stockDisplay.style.color = "red";
            stockDisplay.textContent = "AGOTADO";
        } else if (stock < 5) {
            stockDisplay.style.color = "orange";
        } else {
            stockDisplay.style.color = "#2e7d32"; // verde
        }

        calcularTotal();
    }

    // ===========================================
    // 5. CALCULAR TOTAL
    // ===========================================
    function calcularTotal() {
        const precio = parseFloat(precioInput.value) || 0;
        const cantidad = parseInt(cantidadInput.value) || 0;
        const total = precio * cantidad;
        totalInput.value = total.toFixed(2);
    }

    // ===========================================
    // 6. REGISTRAR VENTA
    // ===========================================
    function registrarVenta() {
    const usuario = usuarioLogueadoInput.value;
    
    if (!usuario) {
        alert("⚠ No se detectó un usuario logueado. Por favor recarga la página o inicia sesión de nuevo.");
        return;
    }

    const selected = productoSelect.selectedOptions[0];
    const stockActual = Number(selected.dataset.stock);
    const cantidad = parseInt(cantidadInput.value);
    const tipo = tipoVentaSelect.value; // Asegúrate de que esta variable esté definida arriba en tu archivo
    const nombreProducto = selected.textContent.split(" - S/")[0];
    
    // 👇 1. CAPTURAR DATOS DEL CLIENTE (NUEVO)
    // Usamos el operador || "" para asegurar que si está vacío envíe un string vacío y no null/undefined
    const codCliente = document.getElementById("codigoCliente").value || "";
    const nomCliente = document.getElementById("nombreCliente").value || "";

    // Validaciones
    if (stockActual <= 0) {
        alert("❌ Este producto está agotado.");
        return;
    }
    if (cantidad > stockActual) {
        alert(`❌ Stock insuficiente. Solo quedan ${stockActual}.`);
        return;
    }

    // Preparar Payload
    const ventaData = {
        menuId: parseInt(selected.value), 
        menuNombre: nombreProducto,
        cantidad: cantidad,
        precioUnitario: parseFloat(precioInput.value),
        total: parseFloat(totalInput.value),
        empleado: usuario,
        
        // 👇 2. AGREGAR AL PAYLOAD (NUEVO)
        codigoCliente: codCliente,
        nombreCliente: nomCliente
    };

    // Enviar al Backend
    fetch("/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ventaData)
    })
    .then(async res => {
        if (!res.ok) throw new Error("Error en el servidor");
        return res.json();
    })
    .then(() => {
        alert(`✅ Venta registrada: ${nombreProducto} (x${cantidad})`);
        
        // Recargar datos para actualizar stock
        cargarDatosIniciales();
        cargarVentas();
        
        // Limpiar formulario
        cantidadInput.value = 1;
        
        // 👇 3. LIMPIAR CAMPOS DE CLIENTE (OPCIONAL)
        document.getElementById("codigoCliente").value = "";
        document.getElementById("nombreCliente").value = "";
    })
    .catch(err => {
        console.error(err);
        alert("❌ Ocurrió un error al registrar la venta.");
    });
}

    // ===========================================
    // 7. CARGAR HISTORIAL DE VENTAS (TABLA INFERIOR)
    // ===========================================
function cargarVentas() {
    fetch("/api/ventas")
        .then(r => r.json())
        .then(data => {
            const tbody = document.getElementById("ventasTableBody");
            tbody.innerHTML = "";
            
            // Mostrar solo las últimas 10 ventas, ordenadas por la más reciente
            const ultimasVentas = data.slice(-10).reverse();

            ultimasVentas.forEach(v => {
                // LÓGICA DE VISUALIZACIÓN DEL CLIENTE
                let clienteDisplay = "";

                if (v.nombreCliente) {
                    // Si tiene nombre, lo mostramos
                    clienteDisplay = `<span style="font-weight:500;">${v.nombreCliente}</span>`;
                    
                    // Si además tiene código, lo agregamos en pequeño al lado
                    if (v.codigoCliente) {
                        clienteDisplay += ` <small style="color:#666; font-size:0.85em;">(${v.codigoCliente})</small>`;
                    }
                } else {
                    // Si no tiene datos, mostramos el default
                    clienteDisplay = '<span style="color:#aaa; font-style:italic;">Público General</span>';
                }

                tbody.innerHTML += `
                    <tr>
                        <td>${v.id}</td>
                        <td>${clienteDisplay}</td> <td>${v.menuNombre}</td>
                        <td style="text-align:center;">${v.cantidad}</td>
                        <td style="text-align:right;">S/ ${v.total.toFixed(2)}</td>
                        <td>${v.fechaVenta ? v.fechaVenta.split(" ")[1] : '-'}</td>
                    </tr>
                `;
            });
        })
        .catch(err => console.error("Error cargando tabla:", err));
}
});
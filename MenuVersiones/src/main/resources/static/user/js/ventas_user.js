document.addEventListener("DOMContentLoaded", () => {

    obtenerUsuarioLogueado();
    cargarProductos();
    cargarVentas();

    const cantidadInput = document.getElementById("cantidad");
    const precioInput = document.getElementById("precio");
    const totalInput = document.getElementById("total");
    const productoSelect = document.getElementById("productoSelect");

    // Eventos
    productoSelect.addEventListener("change", actualizarPrecio);
    cantidadInput.addEventListener("input", calcularTotal);

    document.getElementById("ventaForm").addEventListener("submit", (e) => {
        e.preventDefault();
        registrarVenta();
    });

    // ===========================================
    // 🔥 OBTENER USUARIO LOGUEADO (empleado real)
    // ===========================================
    async function obtenerUsuarioLogueado() {
        try {
            const resp = await fetch("/api/usuarios/mi-info");

            if (!resp.ok) {
                console.error("No se pudo obtener el usuario logueado");
                return;
            }

            const data = await resp.json();
            document.getElementById("usuarioLogueado").value = data.username;

        } catch (e) {
            console.error("Error obteniendo info del usuario:", e);
        }
    }

    // ===========================================
    // 🔥 CARGAR PRODUCTOS
    // ===========================================
    function cargarProductos() {
        fetch("/api/menus")
            .then(res => res.json())
            .then(data => {
                const select = document.getElementById("productoSelect");
                select.innerHTML = "";

                data.forEach(menu => {
                    const option = document.createElement("option");
                    option.value = menu.id;
                    option.textContent = menu.nombre;
                    option.dataset.precio = menu.precio;
                    select.appendChild(option);
                });

                actualizarPrecio();
            })
            .catch(err => console.error("Error cargando productos:", err));
    }

    // ===========================================
    // 🔥 ACTUALIZAR PRECIO
    // ===========================================
    function actualizarPrecio() {
        const selected = productoSelect.selectedOptions[0];
        if (!selected) return;

        precioInput.value = selected.dataset.precio || 0;
        calcularTotal();
    }

    // ===========================================
    // 🔥 CALCULAR TOTAL
    // ===========================================
    function calcularTotal() {
        totalInput.value = (cantidadInput.value * precioInput.value).toFixed(2);
    }

    // ===========================================
    // 🔥 REGISTRAR VENTA
    // ===========================================
    function registrarVenta() {

        const user = document.getElementById("usuarioLogueado").value;

        if (!user) {
            alert("⚠ No se detectó un usuario logueado.");
            return;
        }

        const selected = productoSelect.selectedOptions[0];

        const venta = {
            menuId: parseInt(selected.value),
            menuNombre: selected.textContent,
            cantidad: parseInt(cantidadInput.value),
            precioUnitario: parseFloat(precioInput.value),
            total: parseFloat(totalInput.value),
            empleado: user   // 💥 guardar el username real
        };

        fetch("/api/ventas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(venta)
        })
        .then(res => res.json())
        .then(() => {
            alert("✅ Venta registrada correctamente");
            cargarVentas();
        })
        .catch(err => console.error("Error registrando venta:", err));
    }

    // ===========================================
    // 🔥 CARGAR LISTA DE VENTAS
    // ===========================================
    function cargarVentas() {
        fetch("/api/ventas")
            .then(res => res.json())
            .then(data => {

                const tbody = document.getElementById("ventasTableBody");
                tbody.innerHTML = "";

                data.forEach(v => {
                    const row = `
                        <tr>
                            <td>${v.id}</td>
                            <td>${v.menuNombre}</td>
                            <td>${v.cantidad}</td>
                            <td>S/. ${v.total.toFixed(2)}</td>
                            <td>${v.fechaVenta}</td>
                        </tr>
                    `;
                    tbody.innerHTML += row;
                });

            })
            .catch(err => console.error("Error cargando ventas:", err));
    }

});

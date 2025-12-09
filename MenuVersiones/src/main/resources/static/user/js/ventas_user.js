document.addEventListener("DOMContentLoaded", async () => {

    obtenerUsuarioLogueado();
    // cargar productos y luego, si viene menuId en la URL, seleccionarlo
    await cargarProductos();
    seleccionarPorQuery();
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
    async function cargarProductos() {
        try {
            const res = await fetch("/api/menus");
            const data = await res.json();
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
            return data;
        } catch (err) {
            console.error("Error cargando productos:", err);
            return [];
        }
    }

    // Si la URL contiene ?menuId=NN, selecciona ese producto en el select
    function seleccionarPorQuery() {
        const params = new URLSearchParams(window.location.search);
        const menuId = params.get('menuId');
        const menuName = params.get('menuName');
        if (!menuId) return;

        const productoSelect = document.getElementById("productoSelect");
        // Buscar opción por value
        const decodedName = menuName ? decodeURIComponent(menuName) : null;
        const opt = Array.from(productoSelect.options).find(o => o.value === menuId || (decodedName && o.text === decodedName));
        if (opt) {
            productoSelect.value = opt.value;
            actualizarPrecio();

            // Mostrar aviso de precarga
            const notice = document.getElementById('preloadNotice');
            if (notice) {
                notice.innerText = `Producto precargado: ${opt.text}`;
                notice.style.display = 'block';
            }
        }
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

document.addEventListener("DOMContentLoaded", () => {

    const tbody = document.querySelector("#tablaVentas tbody");
    const paginacionDiv = document.getElementById("paginacion");

    const filtroFecha = document.getElementById("filtroFecha");
    const filtroEmpleado = document.getElementById("filtroEmpleado");
    const filtroMenu = document.getElementById("filtroMenu");
    const btnLimpiar = document.getElementById("btnLimpiar");

    const ventasDelDiaEl = document.getElementById("ventasDelDia");
    const totalVentasEl = document.getElementById("totalVentas");
    const empleadoTopEl = document.getElementById("empleadoTop");

    let ventas = [];
    let ventasFiltradas = [];
    let paginaActual = 1;
    const filasPorPagina = 10;

    // ============================
    // Cargar datos
    // ============================
    const cargarVentas = async () => {
        const resp = await fetch("/api/ventas");
        ventas = await resp.json();
        ventasFiltradas = [...ventas];

        renderTabla();
        renderPaginacion();
        actualizarEstadisticas();
    };

    const actualizarEstadisticas = async () => {
        const resp = await fetch("/api/ventas/del-dia");
        const monto = await resp.json();
        ventasDelDiaEl.textContent = "S/ " + Number(monto || 0).toFixed(2);

        totalVentasEl.textContent = ventas.length;

        // Empleado top
        const conteo = {};
        ventas.forEach(v => {
            conteo[v.empleado] = (conteo[v.empleado] || 0) + 1;
        });

        const top = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0];
        empleadoTopEl.textContent = top ? top[0] : "-";
    };

    // ============================
    // Render tabla
    // ============================
    const renderTabla = () => {
        tbody.innerHTML = "";

        const lista = ventasFiltradas.slice(
            (paginaActual - 1) * filasPorPagina,
            paginaActual * filasPorPagina
        );

        lista.forEach(v => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${v.id}</td>
                <td>${new Date(v.fecha).toLocaleString("es-PE")}</td>
                <td>${v.empleado}</td>
                <td>${v.menuNombre}</td>
                <td>${v.cantidad}</td>
                <td>S/ ${v.total.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
    };

    // ============================
    // Paginación
    // ============================
    const renderPaginacion = () => {
        paginacionDiv.innerHTML = "";

        const totalPaginas = Math.ceil(ventasFiltradas.length / filasPorPagina);
        for (let i = 1; i <= totalPaginas; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.onclick = () => {
                paginaActual = i;
                renderTabla();
            };
            paginacionDiv.appendChild(btn);
        }
    };

    // ============================
    // Filtros
    // ============================
    const aplicarFiltros = () => {
        const fEmpleado = filtroEmpleado.value.toLowerCase();
        const fMenu = filtroMenu.value.toLowerCase();
        const fFecha = filtroFecha.value;

        ventasFiltradas = ventas.filter(v => {
            const coincideEmpleado = v.empleado.toLowerCase().includes(fEmpleado);
            const coincideMenu = v.menuNombre.toLowerCase().includes(fMenu);
            const coincideFecha = !fFecha || v.fecha.startsWith(fFecha);

            return coincideEmpleado && coincideMenu && coincideFecha;
        });

        paginaActual = 1;
        renderTabla();
        renderPaginacion();
    };

    filtroFecha.addEventListener("change", aplicarFiltros);
    filtroEmpleado.addEventListener("input", aplicarFiltros);
    filtroMenu.addEventListener("input", aplicarFiltros);

    btnLimpiar.addEventListener("click", () => {
        filtroFecha.value = "";
        filtroEmpleado.value = "";
        filtroMenu.value = "";
        ventasFiltradas = [...ventas];
        aplicarFiltros();
    });

    // ============================
    // Carga inicial
    // ============================
    cargarVentas();
});

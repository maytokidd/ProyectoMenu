// admin/js/ventas.js
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
    const filasPorPagina = 5;

    // ============================
    // Utils
    // ============================
    const formatearFecha = (fechaIso) => {
        if (!fechaIso) return "-";
        const d = new Date(fechaIso);
        if (isNaN(d)) return "-";
        return d.toLocaleString("es-PE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const mismaFecha = (fechaIso, yyyyMmDd) => {
        if (!yyyyMmDd) return true; // sin filtro → mostrar todo
        return fechaIso.substring(0, 10) === yyyyMmDd;
    };

    const obtenerVentasPaginadas = () => {
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        return ventasFiltradas.slice(inicio, fin);
    };

    // ============================
    // Carga de datos
    // ============================
    const cargarVentas = async () => {
        try {
            // 1) Todas las ventas
            const resp = await fetch("/api/ventas");
            if (!resp.ok) throw new Error("Error al cargar ventas");
            ventas = await resp.json();
            ventasFiltradas = [...ventas];

            // Total de ventas (número de registros)
            totalVentasEl.textContent = ventas.length;

            aplicarFiltros(); // Render inicial de tabla

            // 2) Monto del día
            const respDia = await fetch("/api/ventas/del-dia");
            if (respDia.ok) {
                const monto = await respDia.json();
                ventasDelDiaEl.textContent = "S/ " + Number(monto || 0).toFixed(2);
            } else {
                ventasDelDiaEl.textContent = "S/ 0.00";
            }

            calcularEmpleadoTop();

        } catch (err) {
            console.error(err);
            ventasDelDiaEl.textContent = "S/ 0.00";
            totalVentasEl.textContent = "0";
            empleadoTopEl.textContent = "-";
        }
    };

    // ============================
    // Render tabla y paginación
    // ============================
    const renderTabla = () => {
        tbody.innerHTML = "";
        const lista = obtenerVentasPaginadas();

        lista.forEach(v => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
    <td>${v.id}</td>
    <td>${formatearFecha(v.fechaVenta)}</td>
    
    <td><strong>${v.empleado || "Desconocido"}</strong></td>

    <td>
        ${v.nombreCliente || '<span class="muted">Público</span>'}
        ${v.codigoCliente ? `<br><small style="color:#666; font-size:0.85em;">(${v.codigoCliente})</small>` : ''}
    </td>

    <td>${v.menuNombre || "-"}</td>
    <td style="text-align:center;">${v.cantidad || 0}</td>
    <td style="text-align:right;">S/ ${Number(v.total || 0).toFixed(2)}</td>
    `;
            tbody.appendChild(tr);
        });
    };

    const renderPaginacion = () => {
        paginacionDiv.innerHTML = "";
        const totalPaginas = Math.ceil(ventasFiltradas.length / filasPorPagina);
        if (totalPaginas <= 1) return;

        for (let i = 1; i <= totalPaginas; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.className = "page-btn";

            btn.style.padding = "6px 12px";
            btn.style.borderRadius = "6px";
            btn.style.border = "1px solid #ccc";
            btn.style.margin = "0 4px";
            btn.style.cursor = "pointer";
            btn.style.background = (i === paginaActual) ? "#007bff" : "#fff";
            btn.style.color = (i === paginaActual) ? "#fff" : "#000";

            btn.onclick = () => {
                paginaActual = i;
                renderTabla();
                renderPaginacion();
            };

            paginacionDiv.appendChild(btn);
        }
    };

    // ============================
    // Filtros
    // ============================
    const aplicarFiltros = () => {
        const fechaFiltro = filtroFecha.value;
        const empleadoFiltro = filtroEmpleado.value.trim().toLowerCase();
        const menuFiltro = filtroMenu.value.trim().toLowerCase();

        ventasFiltradas = ventas.filter(v => {
            const coincideFecha = mismaFecha(v.fechaVenta, fechaFiltro);

            const empleado = (v.empleado || "").toLowerCase();
            const coincideEmpleado = !empleadoFiltro || empleado.includes(empleadoFiltro);

            const menu = (v.menuNombre || "").toLowerCase();
            const coincideMenu = !menuFiltro || menu.includes(menuFiltro);

            return coincideFecha && coincideEmpleado && coincideMenu;
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
        paginaActual = 1;
        renderTabla();
        renderPaginacion();
    });

    // ============================
    // Empleado con más ventas
    // ============================
    const calcularEmpleadoTop = () => {
        if (!ventas.length) {
            empleadoTopEl.textContent = "-";
            return;
        }

        const mapa = {};

        ventas.forEach(v => {
            const emp = v.empleado || "Sin nombre";
            mapa[emp] = (mapa[emp] || 0) + Number(v.total || 0);
        });

        let topEmpleado = "-";
        let maxTotal = 0;

        Object.entries(mapa).forEach(([emp, total]) => {
            if (total > maxTotal) {
                maxTotal = total;
                topEmpleado = emp;
            }
        });

        empleadoTopEl.textContent = topEmpleado;
    };

    // ============================
    // Carga inicial
    // ============================
    cargarVentas();
});

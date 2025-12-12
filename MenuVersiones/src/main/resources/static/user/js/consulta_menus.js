document.addEventListener("DOMContentLoaded", async () => {
    const tablaBody = document.querySelector("#tablaMenus tbody");
    const buscar = document.getElementById("buscar");
    const paginacion = document.getElementById("paginacion");

    let menus = [];
    let menusFiltrados = [];
    let paginaActual = 1;
    const filasPorPagina = 9;

    // 1. Cargar datos
    try {
        const res = await fetch("/api/menus");
        menus = await res.json();
        menusFiltrados = [...menus];
        renderTabla();
    } catch (err) {
        console.error("Error cargando menús:", err);
    }

    // 2. Renderizar tabla
    function renderTabla() {
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;
        const datosPagina = menusFiltrados.slice(inicio, fin);

        tablaBody.innerHTML = "";

        datosPagina.forEach(m => {
            // Badges para el estado (Igual que en admin)
            const estadoBadge = m.disponible 
                ? `<span style="background:#d5f5dd; color:#1e7b34; padding:4px 8px; border-radius:6px; font-weight:bold; font-size:12px;">🟢 Disponible</span>` 
                : `<span style="background:#fdecec; color:#c62828; padding:4px 8px; border-radius:6px; font-weight:bold; font-size:12px;">🔴 Agotado</span>`;

            // Fila
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="font-weight:600; color:#2c3e50;">${m.nombre}</td>
                <td><span style="background:#f0f4f8; color:#555; padding:4px 8px; border-radius:4px; font-size:12px;">${m.categoria || 'General'}</span></td>
                <td style="font-weight:bold;">S/ ${m.precio.toFixed(2)}</td>
                <td>${m.stock !== null ? m.stock : '0'}</td>
                <td>${estadoBadge}</td>
                <td style="text-align:right;">
                    ${m.disponible && m.stock > 0 
                        ? `<a class="btn-vender" href="ventas_user.html?menuId=${m.id}&menuName=${encodeURIComponent(m.nombre)}" 
                             style="background:#007bff; color:white; padding:6px 12px; border-radius:6px; text-decoration:none; font-size:13px;">🛒 Vender</a>` 
                        : `<span style="color:#aaa; font-size:13px;">No disponible</span>`
                    }
                </td>
            `;
            tablaBody.appendChild(tr);
        });

        renderPaginacion();
    }

    // 3. Paginación
    function renderPaginacion() {
        paginacion.innerHTML = "";
        const totalPaginas = Math.ceil(menusFiltrados.length / filasPorPagina);

        if (totalPaginas <= 1) return;

        for (let i = 1; i <= totalPaginas; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            btn.className = i === paginaActual ? "active" : "";
            // Estilos inline para simplicidad (puedes moverlos al CSS)
            btn.style.margin = "0 2px";
            btn.style.padding = "6px 12px";
            btn.style.border = "1px solid #ddd";
            btn.style.background = i === paginaActual ? "#007bff" : "#fff";
            btn.style.color = i === paginaActual ? "#fff" : "#333";
            btn.style.borderRadius = "4px";
            btn.style.cursor = "pointer";
            
            btn.onclick = () => {
                paginaActual = i;
                renderTabla();
            };
            paginacion.appendChild(btn);
        }
    }

    // 4. Filtro
    buscar.addEventListener("input", (e) => {
        const texto = e.target.value.toLowerCase();
        menusFiltrados = menus.filter(m => m.nombre.toLowerCase().includes(texto));
        paginaActual = 1;
        renderTabla();
    });
});
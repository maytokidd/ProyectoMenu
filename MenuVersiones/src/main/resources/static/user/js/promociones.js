document.addEventListener("DOMContentLoaded", async () => {

    // Llamada al backend
    const res = await fetch("http://localhost:8080/api/promociones");
    let promociones = await res.json();

    // Filtrar solo: Activas + Programadas
    promociones = promociones.filter(p =>
        p.activa === "Activa" 
    );

    const promoList = document.getElementById("promoList");
    const paginacion = document.getElementById("paginacionPromos");

    // Config paginación
    const porPagina = 4;
    let paginaActual = 1;

    // Formatea fechas bonito
    const formatFecha = (f) => {
        if (!f) return "—";
        const date = new Date(f);
        return date.toLocaleDateString("es-PE", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    // Render promociones
    function mostrarPromociones() {
        promoList.innerHTML = "";

        const inicio = (paginaActual - 1) * porPagina;
        const fin = inicio + porPagina;
        const pagina = promociones.slice(inicio, fin);

        pagina.forEach(p => {
            promoList.innerHTML += `
                <div class="promo-card">
                    <h3>${p.titulo}</h3>
                    <p>${p.descripcion}</p>

                    <p><strong>Precio Oferta:</strong> S/ ${p.precioOferta.toFixed(2)}</p>
                    <p><strong>Inicio:</strong> ${formatFecha(p.fechaInicio)}</p>
                    <p><strong>Fin:</strong> ${formatFecha(p.fechaFin)}</p>

                    <p class="estado ${p.activa}">
                        ${p.activa === "Activa" ? "🟢 Activa" : "🟡 Programada"}
                    </p>
                </div>
            `;
        });

        renderPaginacion();
    }

    // Paginación
    function renderPaginacion() {
        paginacion.innerHTML = "";

        const totalPaginas = Math.ceil(promociones.length / porPagina);

        paginacion.innerHTML += `
            <button onclick="cambiarPagina(${paginaActual - 1})" ${paginaActual === 1 ? "disabled" : ""}>⬅</button>
        `;

        for (let i = 1; i <= totalPaginas; i++) {
            paginacion.innerHTML += `
                <button class="${i === paginaActual ? "active" : ""}" onclick="cambiarPagina(${i})">
                    ${i}
                </button>
            `;
        }

        paginacion.innerHTML += `
            <button onclick="cambiarPagina(${paginaActual + 1})" ${paginaActual === totalPaginas ? "disabled" : ""}>➡</button>
        `;
    }

    // Cambio de página
    window.cambiarPagina = function (num) {
        const totalPaginas = Math.ceil(promociones.length / porPagina);
        if (num < 1 || num > totalPaginas) return;
        paginaActual = num;
        mostrarPromociones();
    };

    mostrarPromociones();
});

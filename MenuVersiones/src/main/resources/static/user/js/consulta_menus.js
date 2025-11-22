document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("http://localhost:8080/api/menus");
    const menus = await res.json();

    const tabla = document.getElementById("tablaMenus");
    const buscar = document.getElementById("buscar");
    const paginacion = document.getElementById("paginacion");

    const filasPorPagina = 5; // ← Cambia este número si quieres más o menos filas
    let paginaActual = 1;
    let menusFiltrados = menus;

    function mostrarTabla() {
        const inicio = (paginaActual - 1) * filasPorPagina;
        const fin = inicio + filasPorPagina;

        tabla.innerHTML = "";

        menusFiltrados.slice(inicio, fin).forEach(m => {
            tabla.innerHTML += `
                <tr>
                    <td>${m.nombre}</td>
                    <td>${m.categoria}</td>
                    <td>S/ ${m.precio.toFixed(2)}</td>
                    <td>${m.disponible ? "Disponible" : "No Disponible"}</td>
                </tr>
            `;
        });

        generarPaginacion();
    }

    function generarPaginacion() {
        const totalPaginas = Math.ceil(menusFiltrados.length / filasPorPagina);

        paginacion.innerHTML = "";

        // Botón anterior
        paginacion.innerHTML += `
            <button ${paginaActual === 1 ? "disabled" : ""} class="page-btn" data-page="${paginaActual - 1}">
                «
            </button>
        `;

        // Botones de número
        for (let i = 1; i <= totalPaginas; i++) {
            paginacion.innerHTML += `
                <button class="page-btn ${i === paginaActual ? "active" : ""}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        // Botón siguiente
        paginacion.innerHTML += `
            <button ${paginaActual === totalPaginas ? "disabled" : ""} class="page-btn" data-page="${paginaActual + 1}">
                »
            </button>
        `;

        document.querySelectorAll(".page-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const page = Number(e.target.getAttribute("data-page"));
                if (!isNaN(page)) {
                    paginaActual = page;
                    mostrarTabla();
                }
            });
        });
    }

    function filtrar() {
        const texto = buscar.value.toLowerCase();
        menusFiltrados = menus.filter(m => m.nombre.toLowerCase().includes(texto));
        paginaActual = 1;
        mostrarTabla();
    }

    buscar.addEventListener("input", filtrar);

    mostrarTabla();
});

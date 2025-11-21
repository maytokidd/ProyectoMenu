document.addEventListener("DOMContentLoaded", () => {


  const tbody = document.querySelector("#tablaMenus tbody");
  const totalMenusEl = document.getElementById("totalMenus");
  const cambiosEl = document.getElementById("cambios");
  const promosEl = document.getElementById("promos");
  const ventasEl = document.getElementById("ventas");

  const btnAgregar = document.getElementById("btnAgregar");
  const btnVerHistorial = document.getElementById("btnVerHistorial");
  const btnReporte = document.getElementById("btnReporte");

  const modal = document.getElementById("modalBackdrop");
  const btnCerrarModal = document.getElementById("closeModal");
  const btnModalGuardar = document.getElementById("modalGuardar");

  let menus = [];
  let menusFiltrados = [];
  let paginaActual = 1;
  const filasPorPagina = 5;

  const buscadorInput = document.getElementById("buscadorInput");
  const filtroCategoria = document.getElementById("filtroCategoria");
  const filtroEstado = document.getElementById("filtroEstado");
  const paginacionDiv = document.getElementById("paginacion");


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

  const esHoy = (fechaIso) => {
    if (!fechaIso) return false;
    const d = new Date(fechaIso);
    if (isNaN(d)) return false;

    const hoy = new Date();
    return (
      d.getFullYear() === hoy.getFullYear() &&
      d.getMonth() === hoy.getMonth() &&
      d.getDate() === hoy.getDate()
    );
  };

  const toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });


  const cargarMenus = async () => {
    try {
      const resp = await fetch("/api/menus");
      if (!resp.ok) throw new Error("Error al cargar menús");

      menus = await resp.json();
      menusFiltrados = [...menus];

      let categorias = [...new Set(menus.map((m) => m.categoria))];
      filtroCategoria.innerHTML =
        '<option value="">Todas las categorías</option>';
      categorias.forEach((cat) => {
        const op = document.createElement("option");
        op.value = cat;
        op.textContent = cat;
        filtroCategoria.appendChild(op);
      });

      renderTablaMenus();
      renderPaginacion();

      totalMenusEl.textContent = menus.length;
      const cambiosHoy = menus.filter((m) => esHoy(m.ultimaModificacion)).length;
      cambiosEl.textContent = cambiosHoy;

      promosEl.textContent = 0;

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los menús desde el servidor.",
      });
    }
  };

  const cargarVentasDelDia = async () => {
    try {
      const resp = await fetch("/api/ventas/del-dia");
      if (!resp.ok) throw new Error("Error al cargar ventas del día");
      const monto = await resp.json();
      ventasEl.textContent = "S/ " + Number(monto || 0).toFixed(2);
    } catch (err) {
      console.error(err);
      ventasEl.textContent = "S/ 0.00";
    }
  };

 
  const renderTablaMenus = () => {
    tbody.innerHTML = "";
    const lista = obtenerMenusPaginados();

    lista.forEach((menu) => {
      const tr = document.createElement("tr");

      const estadoTexto = menu.disponible
        ? "<span class='estado disponible'>🟢 Disponible</span>"
        : "<span class='estado no-disponible'>🔴 No disponible</span>";

      tr.innerHTML = `
        <td>${menu.nombre}</td>
        <td>${menu.categoria}</td>
        <td>S/ ${Number(menu.precio).toFixed(2)}</td>
        <td>${estadoTexto}</td>
        <td>${formatearFecha(menu.ultimaModificacion || menu.fechaCreacion)}</td>
        <td>${menu.responsable || "Administrador"}</td>
        <td style="text-align:right;">
          <button class="btn-sm" data-accion="editar" data-id="${menu.id}">✏ Editar</button>
          <button class="btn-sm" data-accion="eliminar" data-id="${menu.id}">🗑 Eliminar</button>
          <button class="btn-sm" data-accion="historial" data-id="${menu.id}">⏱ Historial</button>
        </td>
      `;

      if (!menu.disponible) {
        tr.classList.add("fila-no-disponible");
      }

      tbody.appendChild(tr);
    });
  };


  const aplicarFiltros = () => {
    const texto = buscadorInput.value.toLowerCase();
    const cat = filtroCategoria.value;
    const est = filtroEstado.value;

    menusFiltrados = menus.filter((menu) => {
      const coincideTexto =
        menu.nombre.toLowerCase().includes(texto) ||
        menu.categoria.toLowerCase().includes(texto);

      const coincideCat = cat === "" || menu.categoria === cat;
      const coincideEst = est === "" || String(menu.disponible) === est;

      return coincideTexto && coincideCat && coincideEst;
    });

    paginaActual = 1;
    renderTablaMenus();
    renderPaginacion();
  };

  const obtenerMenusPaginados = () => {
    const inicio = (paginaActual - 1) * filasPorPagina;
    const fin = inicio + filasPorPagina;
    return menusFiltrados.slice(inicio, fin);
  };

  const renderPaginacion = () => {
    paginacionDiv.innerHTML = "";

    const totalPaginas = Math.ceil(menusFiltrados.length / filasPorPagina);
    if (totalPaginas <= 1) return;

    for (let i = 1; i <= totalPaginas; i++) {
      const boton = document.createElement("button");
      boton.textContent = i;
      boton.style.padding = "6px 12px";
      boton.style.borderRadius = "6px";
      boton.style.border = "1px solid #ccc";
      boton.style.background = i === paginaActual ? "#007bff" : "white";
      boton.style.color = i === paginaActual ? "white" : "black";
      boton.onclick = () => {
        paginaActual = i;
        renderTablaMenus();
        renderPaginacion();
      };
      paginacionDiv.appendChild(boton);
    }
  };

 
  tbody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.dataset.id;
    const accion = btn.dataset.accion;
    const menu = menus.find((m) => String(m.id) === String(id));

    if (!menu) {
      Swal.fire({
        icon: "error",
        title: "Ups",
        text: "Menú no encontrado.",
      });
      return;
    }

    if (accion === "editar") {
      window.location.href = `gestion_menus.html?id=${id}`;
      return;
    }

    if (accion === "eliminar") {
      const { isConfirmed } = await Swal.fire({
        title: `¿Eliminar menú "${menu.nombre}"?`,
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (!isConfirmed) return;

      try {
        const resp = await fetch(`/api/menus/${id}`, { method: "DELETE" });
        if (!resp.ok) throw new Error("Error al eliminar");

        toast.fire({
          icon: "success",
          title: "Eliminado correctamente",
        });

        await cargarMenus();
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el menú.",
        });
      }
    }

    if (accion === "historial") {
      try {
        const resp = await fetch(`/api/menus/${id}/versiones`);
        if (!resp.ok) throw new Error("Error historial");

        const versiones = await resp.json();
        if (!versiones.length) {
          Swal.fire({
            icon: "info",
            title: "Sin historial",
            text: `El menú "${menu.nombre}" no tiene historial.`,
          });
          return;
        }

        let html = `
        <div style="max-height:300px;overflow:auto;text-align:left;">
        <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
          <thead>
            <tr>
              <th style="border-bottom:1px solid #ddd;padding:4px;">Fecha</th>
              <th style="border-bottom:1px solid #ddd;padding:4px;">Usuario</th>
              <th style="border-bottom:1px solid #ddd;padding:4px;">Motivo</th>
            </tr>
          </thead>
          <tbody>
        `;

        versiones.forEach((v) => {
          html += `
            <tr>
              <td style="border-bottom:1px solid #eee;padding:4px;">${formatearFecha(
                v.fechaCambio
              )}</td>
              <td style="border-bottom:1px solid #eee;padding:4px;">${v.usuario}</td>
              <td style="border-bottom:1px solid #eee;padding:4px;">${
                v.motivo
              }</td>
            </tr>
          `;
        });

        html += "</tbody></table></div>";

        Swal.fire({
          icon: "info",
          title: `Historial de ${menu.nombre}`,
          html,
          width: 700,
        });
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al obtener historial.",
        });
      }
    }
  });

  buscadorInput.addEventListener("input", aplicarFiltros);
  filtroCategoria.addEventListener("change", aplicarFiltros);
  filtroEstado.addEventListener("change", aplicarFiltros);

  btnAgregar.addEventListener("click", () => {
    window.location.href = "gestion_menus.html";
  });

  btnVerHistorial.addEventListener("click", async () => {
  try {
      const resp = await fetch("/api/menus/historial");
      if (!resp.ok) throw new Error();

      const data = await resp.json();

      if (!data.length) {
          Swal.fire({
              icon: "info",
              title: "Sin historial",
              text: "No hay cambios registrados aún."
          });
          return;
      }

      let html = `
      <div style="max-height:300px; overflow:auto;">
      <table style="width:100%; border-collapse:collapse; font-size:14px;">
        <thead>
          <tr>
            <th style="padding:6px; border-bottom:1px solid #ddd;">Menú</th>
            <th style="padding:6px; border-bottom:1px solid #ddd;">Fecha</th>
            <th style="padding:6px; border-bottom:1px solid #ddd;">Usuario</th>
          </tr>
        </thead>
        <tbody>
      `;

      data.forEach(v => {
          html += `
            <tr>
              <td style="padding:6px;">${v.menuNombre}</td>
              <td style="padding:6px;">${new Date(v.fechaCambio).toLocaleString("es-PE")}</td>
              <td style="padding:6px;">${v.usuario}</td>
            </tr>
          `;
      });

      html += `</tbody></table></div>`;

      Swal.fire({
          icon: "info",
          title: "Historial global de cambios",
          html,
          width: 700
      });

  } catch (err) {
      Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener el historial global."
      });
      console.log(err);
  }
});




  btnReporte.addEventListener("click", () => {
  if (!menus || !menus.length) {
    Swal.fire({
      icon: "info",
      title: "Sin datos",
      text: "No hay menús para generar el reporte.",
    });
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "mm", "a4");

  doc.setFontSize(16);
  doc.text("Reporte de Menús - Cafetería UTP", 14, 18);
  doc.setFontSize(10);
  doc.text(
    "Generado: " + new Date().toLocaleString("es-PE"),
    14,
    24
  );

  const filas = menus.map((m) => [
    m.nombre,
    m.categoria.replace(/[\u{1F300}-\u{1FAFF}]/gu, "").trim(),
    "S/ " + Number(m.precio).toFixed(2),
    m.disponible ? "Disponible" : "No disponible",
    formatearFecha(m.ultimaModificacion || m.fechaCreacion),
    m.responsable || "Administrador",
  ]);

  doc.autoTable({
    startY: 30,
    head: [
      [
        "Nombre",
        "Categoría",
        "Precio",
        "Estado",
        "Última modificación",
        "Responsable",
      ],
    ],
    body: filas,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [183, 28, 36] }, // rojo UTP
  });

  const nombreArchivo =
    "reporte_menus_" + new Date().toISOString().slice(0, 10) + ".pdf";
  doc.save(nombreArchivo);
});


  btnCerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  btnModalGuardar.addEventListener("click", () => {
    toast.fire({
      icon: "info",
      title: "Guardado simulado.",
    });
    modal.style.display = "none";
  });

  cargarMenus();
  cargarVentasDelDia();
});

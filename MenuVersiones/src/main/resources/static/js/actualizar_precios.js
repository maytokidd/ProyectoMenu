const API_URL = "http://localhost:8080/menus";

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(API_URL);
  const menus = await res.json();

  renderMenus(menus);
  renderHistorial([
    {
      nombre: "Lomo Saltado",
      anterior: 18,
      nuevo: 20,
      motivo: "Ajuste por incremento en costos de ingredientes",
      estado: "Pendiente",
      fecha: "2025-10-20 09:30",
      respuesta: ""
    },
    {
      nombre: "Ceviche",
      anterior: 20,
      nuevo: 22,
      motivo: "Pescado premium de temporada",
      estado: "Aprobado",
      fecha: "2025-10-19 14:20",
      respuesta: "Aprobado por administrador"
    },
    {
      nombre: "Ají de Gallina",
      anterior: 15,
      nuevo: 17,
      motivo: "Actualización mensual",
      estado: "Rechazado",
      fecha: "2025-10-19 11:15",
      respuesta: "El incremento es demasiado alto"
    }
  ]);
});

function renderMenus(menus) {
  const cont = document.getElementById("cardsContainer");
  cont.innerHTML = "";

  menus.forEach(m => {
    cont.innerHTML += `
      <div class="card">
        <div class="header">
          <h4>${m.nombre}</h4>
          <span class="badge">${m.categoria || "Almuerzo"}</span>
        </div>
        <div class="row">
          <p class="label">Precio Actual</p>
          <p>S/ ${m.precio.toFixed(2)}</p>
        </div>
        <div class="row">
          <p class="label">Nuevo Precio</p>
          <input type="number" class="input" placeholder="0.00" step="0.10" min="0">
        </div>
        <div class="row toggle">
          <input type="checkbox" id="disp_${m.id}" checked>
          <label for="disp_${m.id}">Disponible</label>
          <span class="estado">Activo</span>
        </div>
        <div class="row">
          <p class="label">Motivo del Cambio *</p>
          <textarea class="input" rows="2" placeholder="Explica el motivo de este cambio..."></textarea>
        </div>
        <button class="btn-send">📤 Enviar para Aprobación</button>
      </div>
    `;
  });
}

function renderHistorial(items) {
  const cont = document.getElementById("historialCambios");
  cont.innerHTML = "";

  items.forEach(it => {
    cont.innerHTML += `
      <div class="history-card">
        <h4>${it.nombre}</h4>
        <p>
          <span class="price-old">S/ ${it.anterior.toFixed(2)}</span>
          → <span class="price-new">S/ ${it.nuevo.toFixed(2)}</span>
        </p>
        <p>${it.motivo}</p>
        <p><strong>Respuesta:</strong> ${it.respuesta || "En revisión"}</p>
        <span class="status ${it.estado.toLowerCase()}">${it.estado}</span>
        <br><small>${it.fecha}</small>
      </div>
    `;
  });
}

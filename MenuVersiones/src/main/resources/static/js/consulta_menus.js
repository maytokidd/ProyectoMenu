const API_URL = "http://localhost:8080/menus";

document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch(API_URL);
  const menus = await res.json();

  mostrarEstadisticas(menus);
  cargarTabla(menus);

  document.getElementById("buscarMenu").addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = menus.filter(m => m.nombre.toLowerCase().includes(texto));
    cargarTabla(filtrados);
  });
});

function mostrarEstadisticas(menus) {
  const total = menus.length;
  const disponibles = menus.filter(m => m.estado === "Disponible").length;
  const noDisponibles = total - disponibles;
  const promedio = menus.reduce((sum, m) => sum + m.precio, 0) / total;

  document.getElementById("totalMenus").textContent = total;
  document.getElementById("disponibles").textContent = disponibles;
  document.getElementById("noDisponibles").textContent = noDisponibles;
  document.getElementById("precioPromedio").textContent = `S/ ${promedio.toFixed(2)}`;
}

function cargarTabla(menus) {
  const tbody = document.getElementById("tablaMenus");
  tbody.innerHTML = "";
  menus.forEach(m => {
    tbody.innerHTML += `
      <tr>
        <td>${m.nombre}</td>
        <td>${m.categoria || 'Almuerzo'}</td>
        <td>S/ ${m.precio.toFixed(2)}</td>
        <td><span class="${m.estado === 'Disponible' ? 'badge-on' : 'badge-off'}">${m.estado}</span></td>
        <td>${m.fecha_modificacion || '-'}</td>
        <td>${m.usuario || '-'}</td>
        <td><button>Ver Detalle</button></td>
      </tr>
    `;
  });
}

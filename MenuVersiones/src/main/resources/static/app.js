const API_URL = "http://localhost:8080/menus";

// Cargar menús al inicio
document.addEventListener("DOMContentLoaded", loadMenus);

// Obtener lista de menús
async function loadMenus() {
  const response = await fetch(API_URL);
  const menus = await response.json();

  const tableBody = document.getElementById("menuBody");
  tableBody.innerHTML = "";

  menus.forEach((menu, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td> <!-- Enumeración consecutiva -->
        <td>${menu.nombre}</td>
        <td>${menu.descripcion}</td>
        <td>S/. ${menu.precio.toFixed(2)}</td>
        <td>
          <button onclick="deleteMenu(${menu.id})">❌ Eliminar</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Agregar un nuevo menú
document.getElementById("menuForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const precio = parseFloat(document.getElementById("precio").value);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, descripcion, precio })
  });

  if (response.ok) {
    loadMenus();
    e.target.reset();
  }
});

// Eliminar un menú
async function deleteMenu(id) {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (response.ok) {
    loadMenus();
  }
}
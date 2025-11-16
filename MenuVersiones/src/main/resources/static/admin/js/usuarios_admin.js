/* Datos iniciales */
const users = [
  { nombre: "Juan Pérez Rodríguez", usuario: "jperez", correo: "jperez@utp.edu.pe", rol: "Administrador", estado: "Activo", ultimoAcceso: "2025-10-20 14:30" },
  { nombre: "María López García", usuario: "mlopez", correo: "mlopez@utp.edu.pe", rol: "Empleado", estado: "Activo", ultimoAcceso: "2025-10-20 11:15" },
  { nombre: "Carlos Ramírez Silva", usuario: "cramirez", correo: "cramirez@utp.edu.pe", rol: "Empleado", estado: "Activo", ultimoAcceso: "2025-10-19 16:45" },
  { nombre: "Ana Torres Mendoza", usuario: "atorres", correo: "atorres@utp.edu.pe", rol: "Empleado", estado: "Activo", ultimoAcceso: "2025-10-19 13:20" },
  { nombre: "Pedro Gutiérrez Cruz", usuario: "pgutierrez", correo: "pgutierrez@utp.edu.pe", rol: "Empleado", estado: "Inactivo", ultimoAcceso: "2025-10-10 09:00" },
  { nombre: "Laura Martínez Vega", usuario: "lmartinez", correo: "lmartinez@utp.edu.pe", rol: "Administrador", estado: "Activo", ultimoAcceso: "2025-10-20 08:15" },
];

const tbody = document.querySelector("#userTable tbody");
const totalCount = document.getElementById("totalCount");
const adminCount = document.getElementById("adminCount");
const empleadoCount = document.getElementById("empleadoCount");
const activoCount = document.getElementById("activoCount");
const inactivoCount = document.getElementById("inactivoCount");

const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");
const stateFilter = document.getElementById("stateFilter");

const modal = document.getElementById("modal");
const addUserBtn = document.getElementById("addUserBtn");
const cancelBtn = document.getElementById("cancelBtn");
const closeModal = document.getElementById("closeModal");
const addUserForm = document.getElementById("addUserForm");

/* ------ RENDER TABLA ------ */
function renderTable() {
  const search = searchInput.value.toLowerCase();
  const role = roleFilter.value;
  const state = stateFilter.value;

  const filtered = users.filter(u => {
    const matchSearch = u.nombre.toLowerCase().includes(search) || u.usuario.toLowerCase().includes(search);
    const matchRole = role === "todos" || u.rol === role;
    const matchState = state === "todos" || u.estado === state;
    return matchSearch && matchRole && matchState;
  });

  tbody.innerHTML = "";

  filtered.forEach(u => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${u.nombre}</td>
      <td>${u.usuario}</td>
      <td>${u.correo}</td>
      <td><span class="rol ${u.rol}">${u.rol}</span></td>
      <td><span class="estado ${u.estado}">${u.estado}</span></td>
      <td>${u.ultimoAcceso}</td>
      <td class="acciones" style="text-align:right;">
        <button title="Editar">✏️</button>
        <button title="Ver">👁️</button>
        <button title="Contraseña">🔑</button>
      </td>
    `;

    tbody.appendChild(tr);
  });

  updateStats();
}

/* ------ STATS ------ */
function updateStats() {
  totalCount.textContent = users.length;
  adminCount.textContent = users.filter(u => u.rol === "Administrador").length;
  empleadoCount.textContent = users.filter(u => u.rol === "Empleado").length;
  activoCount.textContent = users.filter(u => u.estado === "Activo").length;
  inactivoCount.textContent = users.filter(u => u.estado === "Inactivo").length;
}

/* ------ EVENTOS ------ */
searchInput.addEventListener("input", renderTable);
roleFilter.addEventListener("change", renderTable);
stateFilter.addEventListener("change", renderTable);

addUserBtn.addEventListener("click", () => modal.style.display = "flex");
cancelBtn.addEventListener("click", () => modal.style.display = "none");
closeModal.addEventListener("click", () => modal.style.display = "none");

addUserForm.addEventListener("submit", e => {
  e.preventDefault();

  const nuevo = {
    nombre: document.getElementById("nombre").value,
    usuario: document.getElementById("usuario").value,
    correo: document.getElementById("correo").value,
    rol: document.getElementById("rol").value,
    estado: document.getElementById("estado").value,
    ultimoAcceso: document.getElementById("ultimoAcceso").value.replace("T", " ")
  };

  users.push(nuevo);

  modal.style.display = "none";
  addUserForm.reset();
  renderTable();
});

/* CERRAR MODAL HACIENDO CLICK FUERA */
window.onclick = e => {
  if (e.target === modal) modal.style.display = "none";
};

/* INICIO */
renderTable();

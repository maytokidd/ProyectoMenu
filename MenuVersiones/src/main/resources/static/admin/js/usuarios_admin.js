const API_URL = "http://localhost:8080/api/usuarios";

let users = [];
let editUserId = null;

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
const modalTitle = document.getElementById("modalTitle");
const alertArea = document.getElementById("alertArea");

// Campos
const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const usuarioInput = document.getElementById("usuario");
const correoInput = document.getElementById("correo");
const passwordInput = document.getElementById("password");
const rolInput = document.getElementById("rol");
const estadoInput = document.getElementById("estado");
const ultimoAccesoInput = document.getElementById("ultimoAcceso");
const passwordHint = document.getElementById("passwordHint");

// --- Utilidades ---
function showAlert(msg, type = "info", timeout = 3500) {
  // type: info | success | danger
  const div = document.createElement("div");
  div.className = `alert ${type}`;
  div.innerText = msg;
  alertArea.appendChild(div);
  setTimeout(() => {
    div.remove();
  }, timeout);
}

function formatDateTimeLocalToDB(value) {
  // value from input datetime-local: "YYYY-MM-DDTHH:mm" -> "YYYY-MM-DD HH:mm:ss"
  if (!value) return null;
  return value.replace("T", " ");
}

function formatDBToInputDatetime(value) {
  if (!value) return "";
  // accept "YYYY-MM-DD HH:mm[:ss]" -> "YYYY-MM-DDTHH:mm"
  const v = value.split(".")[0]; // drop fractions
  return v.replace(" ", "T").slice(0,16);
}

// --- API calls ---
async function fetchUsers() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al obtener usuarios");
    users = await res.json();
    renderTable();
  } catch (err) {
    console.error(err);
    showAlert("No se pudo obtener usuarios. Revisa el backend.", "danger", 5000);
  }
}

async function fetchUserByUsername(username) {
  try {
    const res = await fetch(`${API_URL}/buscar?username=${encodeURIComponent(username)}`);
    if (res.status === 200) return await res.json();
    return null;
  } catch (err) {
    return null;
  }
}

async function createUser(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error creando usuario");
  return await res.json();
}

async function updateUser(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error actualizando usuario");
  return await res.json();
}

async function deleteUser(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error eliminando usuario");
  return await res.text();
}

async function changeEstado(id, nuevoEstado) {
  const res = await fetch(`${API_URL}/${id}/estado?estado=${encodeURIComponent(nuevoEstado)}`, {
    method: "PATCH"
  });
  if (!res.ok) throw new Error("Error actualizando estado");
  return await res.json();
}

// --- Render tabla ---
function renderTable() {
  const search = (searchInput.value || "").toLowerCase();
  const role = roleFilter.value;
  const state = stateFilter.value;

  const filtered = users.filter(u => {
    const matchSearch = (u.nombre || "").toLowerCase().includes(search) ||
                        (u.username || "").toLowerCase().includes(search);
    const matchRole = role === "todos" || (u.rol || "") === role;
    const matchState = state === "todos" || (u.estado || "") === state;
    return matchSearch && matchRole && matchState;
  });

  tbody.innerHTML = "";
  filtered.forEach(u => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${(u.nombre || "") + (u.apellido ? " " + u.apellido : "")}</td>
      <td>${u.username || ""}</td>
      <td>${u.email || ""}</td>
      <td><span class="rol ${u.rol}">${u.rol || ""}</span></td>
      <td><span class="estado ${u.estado}">${u.estado || ""}</span></td>
      <td>${u.ultimoAcceso || ""}</td>
      <td class="acciones" style="text-align:right;">
        <button title="Editar" class="editBtn">✏️</button>
        <button title="Activar/Desactivar" class="toggleBtn">${u.estado === 'Activo' ? '🔒 Desactivar' : '✅ Activar'}</button>
        <button title="Eliminar" class="deleteBtn">🗑️</button>
      </td>
    `;

    // Editar
    tr.querySelector(".editBtn").addEventListener("click", () => {
      editUserId = u.id;
      modalTitle.innerText = "Editar Usuario";
      nombreInput.value = u.nombre || "";
      apellidoInput.value = u.apellido || "";
      usuarioInput.value = u.username || "";
      correoInput.value = u.email || "";
      passwordInput.value = ""; // vacío: editar contraseña es opcional
      passwordHint.innerText = "(dejar vacío para mantener la misma)";
      rolInput.value = u.rol || "Empleado";
      estadoInput.value = u.estado || "Activo";
      ultimoAccesoInput.value = formatDBToInputDatetime(u.ultimoAcceso);
      modal.style.display = "flex";
    });

    // Toggle estado
    tr.querySelector(".toggleBtn").addEventListener("click", async () => {
      try {
        const nuevo = u.estado === "Activo" ? "Inactivo" : "Activo";
        await changeEstado(u.id, nuevo);
        showAlert(`Estado actualizado a ${nuevo}`, "success");
        await fetchUsers();
      } catch (err) {
        console.error(err);
        showAlert("No se pudo cambiar el estado", "danger");
      }
    });

    // Eliminar
    tr.querySelector(".deleteBtn").addEventListener("click", async () => {
      if (!confirm(`¿Eliminar usuario ${u.username}?`)) return;
      try {
        await deleteUser(u.id);
        showAlert("Usuario eliminado", "success");
        await fetchUsers();
      } catch (err) {
        console.error(err);
        showAlert("Error al eliminar usuario", "danger");
      }
    });

    tbody.appendChild(tr);
  });

  updateStats();
}

function updateStats() {
  totalCount.textContent = users.length;
  adminCount.textContent = users.filter(u => (u.rol || "") === "Administrador").length;
  empleadoCount.textContent = users.filter(u => (u.rol || "") === "Empleado").length;
  activoCount.textContent = users.filter(u => (u.estado || "") === "Activo").length;
  inactivoCount.textContent = users.filter(u => (u.estado || "") === "Inactivo").length;
}

// --- Eventos UI ---
searchInput.addEventListener("input", renderTable);
roleFilter.addEventListener("change", renderTable);
stateFilter.addEventListener("change", renderTable);

addUserBtn.addEventListener("click", () => {
  editUserId = null;
  modalTitle.innerText = "Agregar Usuario";
  addUserForm.reset();
  passwordHint.innerText = "(obligatoria al crear)";
  modal.style.display = "flex";
});

cancelBtn.addEventListener("click", () => modal.style.display = "none");
closeModal.addEventListener("click", () => modal.style.display = "none");

addUserForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // collect data
  const usuarioData = {
    nombre: nombreInput.value.trim(),
    apellido: apellidoInput.value.trim(),
    username: usuarioInput.value.trim(),
    email: correoInput.value.trim(),
    rol: rolInput.value,
    estado: estadoInput.value,
    ultimoAcceso: formatDateTimeLocalToDB(ultimoAccesoInput.value) // optional
  };

  const passValue = passwordInput.value;

  try {
    // VALIDACIONES frontend básicas
    if (!usuarioData.nombre || !usuarioData.username || !usuarioData.email) {
      showAlert("Completa los campos obligatorios (nombre, usuario, correo).", "danger");
      return;
    }

    // si crear -> contraseña obligatoria
    if (!editUserId && (!passValue || passValue.length < 4)) {
      showAlert("Contraseña obligatoria (mínimo 4 caracteres) al crear usuario.", "danger");
      return;
    }

    // verificar username único (si es creación o nombre cambiado en edición)
    const existing = await fetchUserByUsername(usuarioData.username);
    if (existing && existing.id) {
      // si estamos editando y el username encontrado NO es el mismo id -> error
      if (!editUserId || (editUserId && existing.id !== editUserId)) {
        showAlert("El username ya existe. Elige otro.", "danger");
        return;
      }
    }

    // incluir password solo si fue proporcionada (backend encripta)
    if (passValue && passValue.length >= 4) {
      usuarioData.password = passValue;
    }

    if (editUserId) {
      await updateUser(editUserId, usuarioData);
      showAlert("Usuario actualizado", "success");
    } else {
      await createUser(usuarioData);
      showAlert("Usuario creado", "success");
    }

    modal.style.display = "none";
    addUserForm.reset();
    await fetchUsers();
  } catch (err) {
    console.error(err);
    showAlert("Error guardando usuario. Revisa consola y backend.", "danger");
  }
});

// cerrar modal al click fuera
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// Inicializar
fetchUsers();
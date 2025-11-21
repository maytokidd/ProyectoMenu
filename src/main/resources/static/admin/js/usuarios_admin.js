const API_URL = "/api/admin/users"; // Endpoint corregido a 'users' para consistencia
const tbody = document.querySelector("#userTable tbody");
const totalCount = document.getElementById("totalCount");
const adminCount = document.getElementById("adminCount");
const empleadoCount = document.getElementById("empleadoCount");
const activoCount = document.getElementById("activoCount");
const inactivoCount = document.getElementById("inactivoCount");

const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");
const stateFilter = document.getElementById("stateFilter");

// Elementos del Modal
const modal = document.getElementById("modal");
const addUserBtn = document.getElementById("addUserBtn");
const cancelBtn = document.getElementById("cancelBtn");
const closeModal = document.getElementById("closeModal");
const addUserForm = document.getElementById("addUserForm");

// Inputs del formulario
const formTitle = document.getElementById("formTitle");
const userIdInput = document.getElementById("userId");
const nombreInput = document.getElementById("nombre");
const usuarioInput = document.getElementById("usuario");
const correoInput = document.getElementById("correo");
const rolInput = document.getElementById("rol");
const estadoInput = document.getElementById("estado");
const claveInput = document.getElementById("clave");
const claveLabel = document.getElementById("claveLabel");

let currentUsers = []; // Cache local de usuarios

/* ------------------ FETCH DATA (READ) ------------------ */
async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar usuarios');
        
        currentUsers = await response.json();
        renderTable();
    } catch (error) {
        console.error("Error en la petición de usuarios:", error);
        alert("Hubo un error al cargar los usuarios del sistema.");
    }
}

/* ------------------ RENDER TABLA ------------------ */
function renderTable() {
    const search = searchInput.value.toLowerCase();
    const role = roleFilter.value;
    const state = stateFilter.value;

    const filtered = currentUsers.filter(u => {
        const nombreCompleto = u.nombre || u.usuario; // Usar 'usuario' si no hay 'nombre'
        const estadoTexto = u.estado ? 'Activo' : 'Inactivo';
        
        const matchSearch = nombreCompleto.toLowerCase().includes(search) || u.usuario.toLowerCase().includes(search);
        const matchRole = role === "todos" || u.rol.toLowerCase() === role.toLowerCase();
        const matchState = state === "todos" || estadoTexto === state;
        return matchSearch && matchRole && matchState;
    });

    tbody.innerHTML = "";

    filtered.forEach(u => {
        const estadoTexto = u.estado ? 'Activo' : 'Inactivo';
        const rolTexto = u.rol ? u.rol.charAt(0).toUpperCase() + u.rol.slice(1) : 'Sin Rol';

        const tr = document.createElement("tr");
        // Nota: El campo fechaRegistro en la tabla se asume que es el campo 'ultimoAcceso' o similar.
        tr.innerHTML = `
            <td>${u.nombre || u.usuario}</td>
            <td>${u.usuario}</td>
            <td>${u.correo}</td>
            <td><span class="rol ${rolTexto.replace(' ', '-')}">${rolTexto}</span></td>
            <td><span class="estado ${estadoTexto}">${estadoTexto}</span></td>
            <td>${u.fechaRegistro || 'N/A'}</td> 
            <td class="acciones" style="text-align:right;">
                <button title="Editar" onclick="openEditModal(${u.id})">✏️</button>
                <button title="Eliminar" onclick="deleteUser(${u.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateStats();
}

/* ------------------ STATS ------------------ */
function updateStats() {
    totalCount.textContent = currentUsers.length;
    adminCount.textContent = currentUsers.filter(u => u.rol && u.rol.toLowerCase() === "administrador").length;
    empleadoCount.textContent = currentUsers.filter(u => u.rol && u.rol.toLowerCase() === "empleado").length;
    activoCount.textContent = currentUsers.filter(u => u.estado).length;
    inactivoCount.textContent = currentUsers.filter(u => !u.estado).length;
}


/* ------------------ CRUD API IMPLEMENTATION ------------------ */

async function saveUser(usuarioData) {
    const isEditing = usuarioData.id;
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${usuarioData.id}` : API_URL;

    // Validar clave al CREAR
    if (!isEditing && (!usuarioData.clave || usuarioData.clave.trim() === '')) {
        alert("La clave es obligatoria para crear un nuevo usuario.");
        return;
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuarioData)
        });

        if (!response.ok) throw new Error('Error al guardar/actualizar usuario.');

        modal.style.display = "none";
        addUserForm.reset();
        fetchUsers(); // Recargar la tabla
    } catch (error) {
        console.error("Error al guardar usuario:", error);
        alert("Hubo un error al procesar el usuario. Verifique la consola.");
    }
}


function deleteUser(id) {
    if (!confirm("¿Está seguro de eliminar este usuario?")) return;

    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(response => {
            if (response.ok) {
                fetchUsers();
            } else {
                throw new Error('Error al eliminar usuario.');
            }
        })
        .catch(error => {
            console.error("Error al eliminar:", error);
            alert("No se pudo eliminar el usuario.");
        });
}


/* ------------------ MODAL & FORM HANDLING ------------------ */

function openEditModal(id) {
    const user = currentUsers.find(u => u.id === id);
    if (!user) return;

    formTitle.textContent = "Editar Usuario (ID: " + id + ")";
    
    // Rellenar campos
    userIdInput.value = user.id;
    nombreInput.value = user.nombre || user.usuario; 
    usuarioInput.value = user.usuario;
    correoInput.value = user.correo;
    rolInput.value = user.rol.charAt(0).toUpperCase() + user.rol.slice(1); // Mayúscula para match con el select
    estadoInput.value = user.estado ? 'Activo' : 'Inactivo';
    
    // Clave: Nunca se rellena la encriptada. Se marca como NO obligatoria
    claveInput.value = '';
    claveInput.required = false; 
    claveLabel.textContent = "Clave (dejar en blanco para no cambiar)";

    modal.style.display = "flex";
}

addUserBtn.addEventListener("click", () => {
    // Resetear para CREAR nuevo usuario
    formTitle.textContent = "Agregar Usuario";
    addUserForm.reset();
    userIdInput.value = ''; 
    claveInput.required = true; // La clave es obligatoria al crear
    claveLabel.textContent = "Clave *";
    modal.style.display = "flex";
});

addUserForm.addEventListener("submit", e => {
    e.preventDefault();
    
    const userData = {
        id: userIdInput.value || null,
        // Nota: El campo 'nombre' no existe en la clase Usuario, pero lo dejamos en el HTML
        usuario: usuarioInput.value,
        correo: correoInput.value,
        rol: rolInput.value.toLowerCase(), // El backend espera minúsculas
        estado: estadoInput.value === 'Activo', // El backend espera booleano
        clave: claveInput.value || null // Null si está vacío, para que el backend lo maneje
    };
    
    saveUser(userData);
});


/* ------------------ EVENTOS INICIALES ------------------ */
searchInput.addEventListener("input", renderTable);
roleFilter.addEventListener("change", renderTable);
stateFilter.addEventListener("change", renderTable);

cancelBtn.addEventListener("click", () => modal.style.display = "none");
closeModal.addEventListener("click", () => modal.style.display = "none");
window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

// Inicio de la carga de datos
fetchUsers();
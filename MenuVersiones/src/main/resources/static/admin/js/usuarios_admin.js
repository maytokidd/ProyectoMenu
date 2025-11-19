// Constante para el endpoint del Backend
const API_URL = "http://localhost:8080/api/usuarios";

// Referencias a elementos del DOM
const tbody = document.querySelector("#userTable tbody");
const totalCount = document.getElementById("totalCount");
const adminCount = document.getElementById("adminCount");
const empleadoCount = document.getElementById("empleadoCount");

// Elementos del Modal
const modal = document.getElementById("modal");
const addUserBtn = document.getElementById("addUserBtn");
const cancelBtn = document.getElementById("cancelBtn");
const closeModal = document.getElementById("closeModal");
const addUserForm = document.getElementById("addUserForm");

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar los usuarios al iniciar la página desde la API
    cargarUsuarios();

    // 2. Eventos del formulario y botones del modal
    addUserForm.addEventListener('submit', manejarEnvioFormulario);
    addUserBtn.addEventListener('click', () => abrirModal());
    closeModal.addEventListener('click', () => cerrarModal());
    cancelBtn.addEventListener('click', () => cerrarModal());
    
    // CERRAR MODAL HACIENDO CLICK FUERA
    window.onclick = e => {
        if (e.target === modal) cerrarModal();
    };


});

// =======================================================
// FUNCIONES DE CONTROL DEL MODAL
// =======================================================

function abrirModal(usuario = null) {
    resetForm();
    const modalTitle = document.getElementById('modalTitle');

    if (usuario) {
        modalTitle.textContent = 'Editar Usuario (ID: ' + usuario.id + ')';
        llenarFormularioParaEditar(usuario);
    } else {
        modalTitle.textContent = 'Registrar Nuevo Usuario';
    }
    modal.style.display = 'flex';
}

function cerrarModal() {
    modal.style.display = 'none';
    resetForm();
}

function resetForm() {
    addUserForm.reset();
    document.getElementById('usuarioId').value = '';
    
    // Requerir el campo de contraseña para el registro
    document.getElementById('password').required = true;
    document.getElementById('password').parentElement.style.display = 'block';
    document.getElementById('passwordLabel').style.display = 'block'; 
}

// =======================================================
// FUNCIONES CRUD
// =======================================================

/**
 * READ: Obtiene todos los usuarios y actualiza la tabla y las tarjetas.
 */
async function cargarUsuarios() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error al obtener los usuarios');
        
        const usuarios = await respuesta.json();
        mostrarUsuariosEnTabla(usuarios);
        actualizarEstadisticas(usuarios);

    } catch (error) {
        console.error("Fallo al cargar usuarios:", error);
    }
}

async function manejarEnvioFormulario(e) {
    e.preventDefault();
    
    const id = document.getElementById('usuarioId').value;
    const usuario = obtenerDatosFormulario();

    // Validar contraseña
    if (!id && !usuario.password) {
        alert("La contraseña es obligatoria para registrar un nuevo usuario.");
        return;
    }
    
    try {
        if (id) {
            // UPDATE
            await actualizarUsuario(id, usuario);
        } else {
            // CREATE
            await crearUsuario(usuario);
        }
        
        cerrarModal();
        cargarUsuarios(); 
        
    } catch (error) {
        alert('Error al guardar el usuario. Verifique que el Username/Email no existan.');
        console.error("Error al guardar:", error);
    }
}

async function crearUsuario(usuario) {
    const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    });
    if (!respuesta.ok) throw new Error(respuesta.statusText);
    alert('Usuario registrado con éxito. La clave ha sido cifrada.');
}

async function actualizarUsuario(id, usuario) {
    // Si la contraseña está vacía, la eliminamos del objeto para que el Backend no la actualice
    if (!usuario.password) {
        delete usuario.password;
    }

    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario)
    });
    if (!respuesta.ok) throw new Error(respuesta.statusText);
    alert('Usuario actualizado con éxito.');
}

window.eliminarUsuario = async function(id) {
    if (!confirm('¿Está seguro de que desea eliminar este usuario?')) return;
    
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) throw new Error(respuesta.statusText);
        
        alert('Usuario eliminado.');
        cargarUsuarios(); 

    } catch (error) {
        console.error("Error al eliminar:", error);
        alert('Error al eliminar el usuario.');
    }
}

// =======================================================
// FUNCIONES DE INTERFAZ (UI)
// =======================================================

function obtenerDatosFormulario() {
    const passwordValue = document.getElementById('password').value;
    
    // Mapeo de IDs del HTML (usuario, correo) a nombres del modelo Java (username, email)
    return {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        username: document.getElementById('username').value,
        email: document.getElementById('correo').value, 
        password: passwordValue || null, 
        rol: document.getElementById('rol').value.toLowerCase() 
    };
}

function llenarFormularioParaEditar(usuario) {
    document.getElementById('usuarioId').value = usuario.id;
    document.getElementById('nombre').value = usuario.nombre;
    document.getElementById('apellido').value = usuario.apellido;
    document.getElementById('username').value = usuario.username;
    document.getElementById('correo').value = usuario.email;
    document.getElementById('rol').value = usuario.rol; 

    // Ocultar campo de contraseña en la edición
    document.getElementById('password').value = ''; 
    document.getElementById('password').required = false; 
    document.getElementById('password').parentElement.style.display = 'none';
    document.getElementById('passwordLabel').style.display = 'none';
}

function mostrarUsuariosEnTabla(usuarios) {
    tbody.innerHTML = ''; 

    usuarios.forEach(u => {
        const row = tbody.insertRow();
        
        row.innerHTML = `
            <td>${u.nombre} ${u.apellido}</td>
            <td>${u.username}</td>
            <td>${u.email}</td>
            <td><span class="rol ${u.rol}">${u.rol.charAt(0).toUpperCase() + u.rol.slice(1)}</span></td>
            <td><span class="estado Activo">Activo</span></td>
            <td>N/A</td> 
            <td class="acciones" style="text-align:right;">
                <button title="Editar" class="btn btn-warning" onclick="abrirModal(${u.id ? u.id : ''}, '${u.username}')">✏️</button>
                <button title="Eliminar" class="btn btn-danger" onclick="eliminarUsuario(${u.id})">🗑️</button>
            </td>
        `;
    });
}

function actualizarEstadisticas(usuarios) {
    const total = usuarios.length;
    const adminCountVal = usuarios.filter(u => u.rol === 'administrador').length;
    const empleadoCountVal = usuarios.filter(u => u.rol === 'empleado').length;

    totalCount.textContent = total;
    adminCount.textContent = adminCountVal;
    empleadoCount.textContent = empleadoCountVal;


    document.getElementById('activoCount').textContent = 'N/A';
    document.getElementById('inactivoCount').textContent = 'N/A';
}
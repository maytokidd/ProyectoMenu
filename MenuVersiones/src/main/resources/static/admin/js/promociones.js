// Constante para el endpoint del Backend
const API_URL = "http://localhost:8080/api/promociones";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar las promociones al iniciar la página
    cargarPromociones();

    // 2. Evento para el formulario de Crear/Editar
    document.getElementById('formPromocion').addEventListener('submit', manejarEnvioFormulario);
});

// =======================================================
// FUNCIONES CRUD (CREATE, READ, UPDATE, DELETE)
// =======================================================

/**
 * READ: Obtiene todas las promociones del Backend y las muestra en la tabla.
 */
async function cargarPromociones() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('Error al obtener las promociones');
        
        const promociones = await respuesta.json();
        mostrarPromocionesEnTabla(promociones);

    } catch (error) {
        console.error("Fallo al cargar promociones:", error);
        alert('No se pudo conectar con el servidor para cargar las promociones.');
    }
}

/**
 * Maneja el envío del formulario, decidiendo si es CREATE o UPDATE.
 */
async function manejarEnvioFormulario(e) {
    e.preventDefault();
    
    const id = document.getElementById('promocionId').value;
    const promocion = obtenerDatosFormulario();

    try {
        if (id) {
            // UPDATE
            await actualizarPromocion(id, promocion);
        } else {
            // CREATE
            await crearPromocion(promocion);
        }
        
        // Limpiar y recargar
        resetForm();
        cargarPromociones();
        
    } catch (error) {
        alert('Error al guardar la promoción: ' + error.message);
    }
}

/**
 * CREATE: Envía una nueva promoción al Backend.
 */
async function crearPromocion(promocion) {
    const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promocion)
    });
    if (!respuesta.ok) throw new Error('Fallo al crear la promoción');
    alert('Promoción creada exitosamente.');
}

/**
 * UPDATE: Envía datos actualizados de una promoción al Backend.
 */
async function actualizarPromocion(id, promocion) {
    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promocion)
    });
    if (!respuesta.ok) throw new Error('Fallo al actualizar la promoción');
    alert('Promoción actualizada exitosamente.');
}

/**
 * DELETE: Elimina una promoción por su ID.
 */
async function eliminarPromocion(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta promoción?')) return;
    
    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!respuesta.ok) throw new Error('Fallo al eliminar la promoción');
        
        alert('Promoción eliminada.');
        cargarPromociones();

    } catch (error) {
        console.error("Error al eliminar:", error);
        alert('Error al eliminar la promoción: ' + error.message);
    }
}

// =======================================================
// FUNCIONES DE INTERFAZ (UI)
// =======================================================

/**
 * Muestra las promociones en la tabla HTML.
 */
function mostrarPromocionesEnTabla(promociones) {
    const tbody = document.getElementById('promocionesTableBody');
    tbody.innerHTML = ''; // Limpiar tabla

    promociones.forEach(p => {
        const row = tbody.insertRow();
        row.insertCell().textContent = p.id;
        row.insertCell().textContent = p.nombre;
        row.insertCell().textContent = p.descripcion;
        row.insertCell().textContent = (p.descuentoPorcentaje * 100).toFixed(0) + '%';
        row.insertCell().textContent = p.fechaInicio;
        row.insertCell().textContent = p.fechaFin;
        row.insertCell().textContent = p.activo ? 'Sí' : 'No';


        const accionesCell = row.insertCell();
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.className = 'btn btn-warning';
        btnEditar.onclick = () => llenarFormularioParaEditar(p);
        accionesCell.appendChild(btnEditar);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn btn-danger';
        btnEliminar.onclick = () => eliminarPromocion(p.id);
        accionesCell.appendChild(btnEliminar);
    });
}

/**
 * Obtiene los valores del formulario.
 */
function obtenerDatosFormulario() {
    return {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,

        descuentoPorcentaje: parseFloat(document.getElementById('descuentoPorcentaje').value), 
        fechaInicio: document.getElementById('fechaInicio').value,
        fechaFin: document.getElementById('fechaFin').value,

        activo: document.getElementById('activo').value === 'true'
    };
}

/**
 * Rellena el formulario con los datos de una promoción para su edición.
 */
function llenarFormularioParaEditar(promocion) {
    document.getElementById('promocionId').value = promocion.id;
    document.getElementById('nombre').value = promocion.nombre;
    document.getElementById('descripcion').value = promocion.descripcion;
    document.getElementById('descuentoPorcentaje').value = promocion.descuentoPorcentaje;
    document.getElementById('fechaInicio').value = promocion.fechaInicio;
    document.getElementById('fechaFin').value = promocion.fechaFin;
    document.getElementById('activo').value = promocion.activo.toString(); // Asignar el booleano al select
    
    document.querySelector('#form-container h2').textContent = 'Editar Promoción (ID: ' + promocion.id + ')';
}

/**
 * Limpia el formulario y lo prepara para crear una nueva promoción.
 */
function resetForm() {
    document.getElementById('formPromocion').reset();
    document.getElementById('promocionId').value = '';
    document.querySelector('#form-container h2').textContent = 'Crear/Editar Promoción';
}
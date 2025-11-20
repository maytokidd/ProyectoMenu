const API_URL = "/api/admin/promociones"; // Endpoint REST de promociones
const tablaBody = document.getElementById("tablaBody");
const formPromocion = document.getElementById("formPromocion");
const modalPromocion = document.getElementById("modalPromocion");
const btnAgregar = document.getElementById("btnAgregar");
const closeModal = document.getElementById("closeModal");
const btnCancel = document.getElementById("btnCancel");
const modalTitulo = document.getElementById("modalTitulo");

/* ------ CARGAR PROMOCIONES ------ */
async function fetchPromociones() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error al cargar promociones');
        const promociones = await response.json();
        renderTable(promociones);
        updateStats(promociones);
    } catch (error) {
        console.error("Error al cargar promociones:", error);
        alert("No se pudieron cargar las promociones.");
    }
}

/* ------ RENDER DE TABLA ------ */
function renderTable(promociones) {
    tablaBody.innerHTML = "";
    promociones.forEach(p => {
        const estadoTexto = p.activo ? 'Activa' : 'Inactiva';
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.titulo}</td>
            <td>${p.descripcion ? p.descripcion.substring(0, 50) + '...' : ''}</td>
            <td>${p.descuento}%</td>
            <td>${p.fechaInicio} a ${p.fechaFin}</td>
            <td><span class="estado ${estadoTexto}">${estadoTexto}</span></td>
            <td>${p.creadoPor ? p.creadoPor.usuario : 'Admin'}</td>
            <td style="text-align:right;">
                <button title="Editar" onclick="editPromocion(${p.id})">✏️</button>
                <button title="Eliminar" onclick="deletePromocion(${p.id})">🗑️</button>
            </td>
        `;
        tablaBody.appendChild(tr);
    });
}

/* ------ ESTADÍSTICAS ------ */
function updateStats(promociones) {
    const totalPromos = promociones.length;
    const activePromos = promociones.filter(p => p.activo).length;
    const totalDescuento = promociones.reduce((sum, p) => sum + p.descuento, 0);
    const avgDiscount = totalPromos > 0 ? (totalDescuento / totalPromos).toFixed(0) : 0;

    document.getElementById("totalPromos").textContent = totalPromos;
    document.getElementById("activePromos").textContent = activePromos;
    document.getElementById("avgDiscount").textContent = `${avgDiscount}%`;
}

/* ------ GUARDAR O ACTUALIZAR PROMOCIÓN ------ */
async function savePromocion(promocionData) {
    const isEditing = promocionData.id;
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${promocionData.id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(promocionData)
        });
        if (!response.ok) throw new Error('Error al guardar promoción');

        modalPromocion.style.display = "none";
        formPromocion.reset();
        fetchPromociones();
    } catch (error) {
        console.error("Error al guardar promoción:", error);
        alert("No se pudo guardar la promoción.");
    }
}

/* ------ ELIMINAR PROMOCIÓN ------ */
function deletePromocion(id) {
    if (!confirm("¿Está seguro de eliminar esta promoción?")) return;

    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) throw new Error('Error al eliminar promoción');
            fetchPromociones();
        })
        .catch(error => {
            console.error("Error al eliminar:", error);
            alert("No se pudo eliminar la promoción.");
        });
}

/* ------ EDITAR PROMOCIÓN ------ */
function editPromocion(id) {
    fetch(`${API_URL}/${id}`)
        .then(res => res.json())
        .then(p => {
            modalTitulo.textContent = "Editar Promoción";
            document.getElementById("promoId").value = p.id;
            document.getElementById("nombre").value = p.titulo;
            document.getElementById("descripcion").value = p.descripcion;
            document.getElementById("descuento").value = p.descuento;
            document.getElementById("estado").value = p.activo ? 'Activa' : 'Inactiva';
            document.getElementById("fechaInicio").value = p.fechaInicio;
            document.getElementById("fechaFin").value = p.fechaFin;
            modalPromocion.style.display = "flex";
        })
        .catch(error => {
            console.error("Error al cargar promoción:", error);
            alert("No se pudo cargar la promoción.");
        });
}

/* ------ MODAL Y FORMULARIO ------ */
btnAgregar.addEventListener("click", () => {
    modalTitulo.textContent = "Nueva Promoción";
    formPromocion.reset();
    document.getElementById("promoId").value = '';
    modalPromocion.style.display = "flex";
});

formPromocion.addEventListener("submit", e => {
    e.preventDefault();
    const promocionData = {
        id: document.getElementById("promoId").value || null,
        titulo: document.getElementById("nombre").value,
        descripcion: document.getElementById("descripcion").value,
        descuento: parseFloat(document.getElementById("descuento").value),
        activo: document.getElementById("estado").value === 'Activa',
        fechaInicio: document.getElementById("fechaInicio").value,
        fechaFin: document.getElementById("fechaFin").value
    };
    savePromocion(promocionData);
});

/* ------ CIERRE DE MODAL ------ */
btnCancel.addEventListener("click", () => modalPromocion.style.display = "none");
closeModal.addEventListener("click", () => modalPromocion.style.display = "none");
window.onclick = e => { if (e.target === modalPromocion) modalPromocion.style.display = "none"; };

/* ------ INICIO: CARGA PROMOCIONES ------ */
fetchPromociones();
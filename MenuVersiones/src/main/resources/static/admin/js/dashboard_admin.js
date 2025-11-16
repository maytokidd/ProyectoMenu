// Datos iniciales
const menus = [
    { nombre: "Lomo Saltado", categoria: "Almuerzo", precio: 20.00, disponible: true, fecha: "2025-10-20 14:30", responsable: "Juan Pérez", promocion: false },
    { nombre: "Ceviche", categoria: "Almuerzo", precio: 22.00, disponible: true, fecha: "2025-10-20 11:15", responsable: "María López", promocion: true },
    { nombre: "Ají de Gallina", categoria: "Almuerzo", precio: 16.50, disponible: true, fecha: "2025-10-19 16:45", responsable: "Carlos Ramírez", promocion: false },
    { nombre: "Arroz con Pollo", categoria: "Almuerzo", precio: 14.00, disponible: true, fecha: "2025-10-19 13:20", responsable: "Ana Torres", promocion: false }
];

const tbody = document.querySelector("#tablaMenus tbody");
const totalMenusEl = document.getElementById("totalMenus");
const cambiosEl = document.getElementById("cambios");
const promosEl = document.getElementById("promos");
const ventasEl = document.getElementById("ventas");

let cambiosRecientes = 12;
cambiosEl.textContent = cambiosRecientes;

function formatPrice(num) {
    return "S/ " + num.toFixed(2);
}

function renderTable() {
    tbody.innerHTML = "";

    menus.forEach((m, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${m.nombre}</td>
            <td>${m.categoria}</td>
            <td>${formatPrice(m.precio)}</td>
            <td><span class="badge ${m.disponible ? 'available' : 'na'}">${m.disponible ? 'Disponible' : 'No disponible'}</span></td>
            <td>${m.fecha}</td>
            <td>${m.responsable}</td>
            <td style="text-align:right;">
                <button class="btn-sm" data-action="editar" data-idx="${i}">Editar</button>
                <button class="btn-sm" data-action="historial" data-idx="${i}">Historial</button>
                <button class="btn-sm" data-action="toggle" data-idx="${i}">Cambiar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    totalMenusEl.textContent = menus.length;
    promosEl.textContent = menus.filter(x => x.promocion).length;

    const ventas = menus.filter(x => x.disponible).reduce((s, x) => s + x.precio * 5, 0);
    ventasEl.textContent = "S/ " + ventas.toFixed(2);

    tbody.querySelectorAll("button").forEach(btn => {
        btn.onclick = onAction;
    });
}

function onAction(e) {
    const action = e.target.dataset.action;
    const idx = parseInt(e.target.dataset.idx);

    if (action === "editar") {
        alert("Editar (simulado): " + menus[idx].nombre);
    } else if (action === "historial") {
        alert("Historial (simulado): " + menus[idx].nombre);
    } else if (action === "toggle") {
        menus[idx].disponible = !menus[idx].disponible;

        cambiosRecientes++;
        cambiosEl.textContent = cambiosRecientes;

        const now = new Date();
        menus[idx].fecha = now.toISOString().slice(0, 16).replace("T", " ");

        renderTable();
    }
}

// MODAL
const modal = document.getElementById("modalBackdrop");

document.getElementById("btnAgregar").onclick = () => {
    modal.style.display = "flex";
};

document.getElementById("closeModal").onclick = () => {
    modal.style.display = "none";
};

document.getElementById("modalGuardar").onclick = () => {
    alert("Guardado simulado");
    modal.style.display = "none";
};

document.getElementById("btnVerHistorial").onclick = () => {
    alert("Historial general (simulado)");
};

document.getElementById("btnReporte").onclick = () => {
    alert("Reporte generado (simulado)");
};

renderTable();

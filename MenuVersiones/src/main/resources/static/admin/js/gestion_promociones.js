const tablaBody = document.getElementById("tablaBody");
const cardsContainer = document.getElementById("cardsContainer");
const totalPromos = document.getElementById("totalPromos");
const activePromos = document.getElementById("activePromos");
const avgDiscount = document.getElementById("avgDiscount");

const modal = document.getElementById("modalPromocion");
const btnAgregar = document.getElementById("btnAgregar");
const btnCancel = document.getElementById("btnCancel");
const closeModal = document.getElementById("closeModal");
const form = document.getElementById("formPromocion");

const inputId = document.getElementById("promoId");
const inputNombre = document.getElementById("nombre");
const inputDesc = document.getElementById("descripcion");
const inputDescPct = document.getElementById("descuento");
const inputInicio = document.getElementById("fechaInicio");
const inputFin = document.getElementById("fechaFin");
const inputEstado = document.getElementById("estado");
const inputResponsable = document.getElementById("responsable");
const selectMenu = document.getElementById("menuSelect");

const API_URL = "http://localhost:8080/api/promociones";
const API_MENUS = "http://localhost:8080/api/menus";

let promotions = [];
let menus = [];

function getRealStatus(p) {
    const hoy = new Date();
    const inicio = new Date(p.fechaInicio);
    const fin = new Date(p.fechaFin);

    if (p.activa !== "Activa") return p.activa; // Programada / Inactiva

    if (hoy < inicio) return "Programada";
    if (hoy > fin) return "Expirada";

    return "Activa";
}

function renderBadgeReal(p) {
    const estado = getRealStatus(p);

    if (estado === "Activa")
        return `<span class="badge activa">Activa</span>`;
    if (estado === "Programada")
        return `<span class="badge programada">Programada</span>`;
    if (estado === "Expirada")
        return `<span class="badge expirada">Expirada</span>`;

    return `<span class="badge inactiva">Inactiva</span>`;
}

async function fetchMenus() {
    const res = await fetch(API_MENUS);
    menus = await res.json();

    selectMenu.innerHTML = "";
    menus.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.id;
        opt.textContent = `${m.nombre} (${m.precio} soles)`;
        selectMenu.appendChild(opt);
    });
}

async function fetchPromotions() {
    try {
        const res = await fetch(API_URL);
        promotions = await res.json();
        reRenderAll();
    } catch (error) {
        console.error("Error cargando promociones:", error);
    }
}

function renderTable() {
    tablaBody.innerHTML = "";

    promotions.forEach(p => {
        const menuName = menus.find(m => m.id === p.menuId)?.nombre || "N/A";

        const tr = document.createElement("tr");

        tr.innerHTML = `
        <td>${p.titulo}</td>
        <td>${p.descripcion}</td>
        <td>${p.precioOferta || 0}</td>
        <td>${p.fechaInicio?.substring(0,10)} → ${p.fechaFin?.substring(0,10)}</td>
        <td>${renderBadgeReal(p)}</td>
        <td>${p.responsable || ""}</td>
        <td>${menuName}</td>
        <td style="text-align:right">
            <button onclick="openEditModal(${p.id})">✏️</button>
            <button onclick="deletePromo(${p.id})">🗑</button>
        </td>
        `;

        tablaBody.appendChild(tr);
    });
}

function renderCards() {
    cardsContainer.innerHTML = "";

    promotions
        .filter(p => getRealStatus(p) === "Activa")
        .forEach(p => {
            const card = document.createElement("div");
            card.className = "promo-card";

            card.innerHTML = `
            <div class="info">
                <h4>${p.titulo}</h4>
                <p>${p.descripcion}</p>
                <small style="color:#777">Hasta ${p.fechaFin?.substring(0,10)}</small>
            </div>
            <div class="pct">${p.precioOferta || 0}%</div>
        `;
            cardsContainer.appendChild(card);
        });
}

function renderStats() {
    totalPromos.textContent = promotions.length;

    activePromos.textContent = promotions.filter(p => getRealStatus(p) === "Activa").length;

    const avg = promotions.reduce((s, p) => s + (p.precioOferta || 0), 0) / promotions.length;
    avgDiscount.textContent = Math.round(avg) + "%";
}

btnAgregar.addEventListener("click", () => {
    modal.style.display = "flex";
    form.reset();
    inputId.value = "";
});

btnCancel.onclick = () => modal.style.display = "none";
closeModal.onclick = () => modal.style.display = "none";

form.addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
        titulo: inputNombre.value,
        descripcion: inputDesc.value,
        precioOferta: Number(inputDescPct.value),
        fechaInicio: inputInicio.value + "T00:00:00",
        fechaFin: inputFin.value + "T23:59:59",
        activa: inputEstado.value,
        responsable: inputResponsable.value,
        menuId: parseInt(selectMenu.value)
    };

    try {
        if (inputId.value) {
            await fetch(`${API_URL}/${inputId.value}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        } else {
            await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        }
        modal.style.display = "none";
        fetchPromotions();
    } catch (e) { console.error(e); }
});

function openEditModal(id) {
    const p = promotions.find(x => x.id === id);
    if (!p) return;

    modal.style.display = "flex";
    inputId.value = p.id;
    inputNombre.value = p.titulo;
    inputDesc.value = p.descripcion;
    inputDescPct.value = p.precioOferta || 0;
    inputInicio.value = p.fechaInicio?.substring(0, 10);
    inputFin.value = p.fechaFin?.substring(0, 10);
    inputEstado.value = p.activa;
    inputResponsable.value = p.responsable || "";
    selectMenu.value = p.menuId;
}

async function deletePromo(id) {
    if (!confirm("¿Eliminar promoción?")) return;

    try {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchPromotions();
    } catch (e) { console.error(e); }
}

function reRenderAll() {
    renderTable();
    renderCards();
    renderStats();
}

(async () => {
    await fetchMenus();
    await fetchPromotions();
})();

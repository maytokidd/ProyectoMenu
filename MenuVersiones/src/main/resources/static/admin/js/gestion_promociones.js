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

const selectPlato = document.getElementById("selectPlatoFondo");
const selectEntrada = document.getElementById("selectEntrada");
const selectPostre = document.getElementById("selectPostre");
const selectBebida = document.getElementById("selectBebida");

const precioRealText = document.getElementById("precioRealText");
const precioFinalText = document.getElementById("precioFinalText");
const stockComboText = document.getElementById("stockComboText");

const API_URL = "http://localhost:8080/api/promociones";
const API_MENUS = "http://localhost:8080/api/menus";

let promotions = [];
let menus = [];

/* ----------------- HELPERS ----------------- */
function formatMoney(n) {
    return Number(n || 0).toFixed(2);
}

/* categoría helper (tolerante, en minúsculas) */
function categoriaEs(menu, key) {
    if (!menu || !menu.categoria) return false;
    return menu.categoria.toLowerCase().includes(key.toLowerCase());
}

/* ----------------- FETCH MENÚS ----------------- */
async function fetchMenus() {
    try {
        const res = await fetch(API_MENUS);
        if (!res.ok) throw new Error("Error al cargar menús");
        menus = await res.json();

        // Organizar por categoría (tolerante a variaciones)
        const platos = menus.filter(m => categoriaEs(m, "fondo") || categoriaEs(m, "plato"));
        const entradas = menus.filter(m => categoriaEs(m, "entrada"));
        const postres = menus.filter(m => categoriaEs(m, "postre"));
        const bebidas = menus.filter(m => categoriaEs(m, "bebida"));

        // fallback: si alguna lista queda vacía, usar items disponibles genéricos para poder seleccionar "Ninguno"
        fillSelect(selectPlato, platos);
        fillSelect(selectEntrada, entradas);
        fillSelect(selectPostre, postres);
        fillSelect(selectBebida, bebidas);
    } catch (err) {
        console.error("fetchMenus error:", err);
        // limpiar selects y mostrar error option
        [selectPlato, selectEntrada, selectPostre, selectBebida].forEach(s => {
            s.innerHTML = '<option value="">Error cargando menús</option>';
            s.disabled = true;
        });
    }
}

function fillSelect(selectEl, items) {
    selectEl.innerHTML = "";
    // Opción Ninguno
    const none = document.createElement("option");
    none.value = "";
    none.textContent = "Ninguno";
    selectEl.appendChild(none);

    items.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.id;
        // mostrar nombre - precio - stock (si existe)
        const stockText = (m.stock !== undefined && m.stock !== null) ? ` — stock: ${m.stock}` : "";
        opt.textContent = `${m.nombre} (${m.categoria}) — S/. ${formatMoney(m.precio)}${stockText}`;
        selectEl.appendChild(opt);
    });

    selectEl.disabled = false;
}

/* ----------------- FETCH PROMOCIONES ----------------- */
async function fetchPromotions() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al cargar promociones");
        promotions = await res.json();
        reRenderAll();
    } catch (error) {
        console.error("Error cargando promociones:", error);
    }
}

/* ----------------- RENDER TABLA ----------------- */
function renderTable() {
    tablaBody.innerHTML = "";

    promotions.forEach(p => {
        // construir lista visible de items seleccionados (por si p tiene los campos nuevos)
        const parts = [];
        const menuIds = [p.platoFondoId, p.entradaId, p.postreId, p.bebidaId];
        menuIds.forEach(id => {
            if (id) {
                const m = menus.find(x => Number(x.id) === Number(id));
                if (m) parts.push(m.nombre);
            }
        });

        const itemsText = parts.length ? parts.join(", ") : (p.menuId ? `Menú ${p.menuId}` : "N/A");

        const precioAntes = p.precioRealTotal ? Number(p.precioRealTotal) : 0;
        const precioOferta = p.precioOferta ? Number(p.precioOferta) : 0;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${p.titulo}</td>
            <td>${p.descripcion}</td>
            <td>S/. ${formatMoney(precioAntes)} → <strong>S/. ${formatMoney(precioOferta)}</strong></td>
            <td>${(p.fechaInicio?.substring(0,10) || "")} → ${(p.fechaFin?.substring(0,10) || "")}</td>
            <td>${renderBadge(p.activa)}</td>
            <td>${p.stockMaximo !== undefined && p.stockMaximo !== null ? p.stockMaximo : "N/A"}</td>
            <td>${itemsText}</td>
            <td style="text-align:right">
                <button onclick="openEditModal(${p.id})">✏️</button>
                <button onclick="deletePromo(${p.id})">🗑</button>
            </td>
        `;
        tablaBody.appendChild(tr);
    });
}

function renderBadge(estado){
    if(estado === "Activa") return `<span class="badge activa">Activa</span>`;
    if(estado === "Programada") return `<span class="badge programada">Programada</span>`;
    return `<span class="badge inactiva">Inactiva</span>`;
}

/* ----------------- RENDER CARDS ----------------- */
function renderCards(){
    cardsContainer.innerHTML = "";
    promotions.filter(p => p.activa === "Activa").forEach(p => {
        const parts = [];
        const menuIds = [p.platoFondoId, p.entradaId, p.postreId, p.bebidaId];
        menuIds.forEach(id => {
            if (id) {
                const m = menus.find(x => Number(x.id) === Number(id));
                if (m) parts.push(m.nombre);
            }
        });
        const menuText = parts.length ? parts.join(", ") : (p.menuId ? `Menú ${p.menuId}` : "");

        const priceHtml = `<div class="pct">S/. ${formatMoney(p.precioOferta || 0)}</div>`;

        const card = document.createElement("div");
        card.className = "promo-card";
        card.innerHTML = `
            <div class="info">
                <h4>${p.titulo}</h4>
                <p>${p.descripcion}</p>
                <small style="color:#777">Válido hasta ${p.fechaFin?.substring(0,10) || ""}</small>
                <div style="margin-top:6px"><small>Stock: ${p.stockMaximo !== undefined && p.stockMaximo !== null ? p.stockMaximo : "N/A"}</small></div>
                <div style="margin-top:6px"><small>${menuText}</small></div>
            </div>
            ${priceHtml}
        `;
        cardsContainer.appendChild(card);
    });
}

/* ----------------- STATS ----------------- */
function renderStats(){
    totalPromos.textContent = promotions.length;
    activePromos.textContent = promotions.filter(p => p.activa === "Activa").length;
    const avg = promotions.length === 0 ? 0 : promotions.reduce((s,p) => s + (Number(p.precioOferta || 0)), 0) / promotions.length;
    avgDiscount.textContent = `S/. ${formatMoney(avg)}`;
}

/* ----------------- MODAL ----------------- */
btnAgregar.addEventListener("click", ()=>{
    modal.style.display="flex";
    form.reset();
    inputId.value="";
    // reset summary
    updateSummary();
});

btnCancel.onclick = () => modal.style.display="none";
closeModal.onclick = () => modal.style.display="none";

/* cuando cambien selects o descuento -> actualizar resumen */
[selectPlato, selectEntrada, selectPostre, selectBebida, inputDescPct].forEach(el => {
    el.addEventListener("change", updateSummary);
});

/* ----------------- CALCULAR RESUMEN ----------------- */
function updateSummary(){
    // obtener ids seleccionados
    const ids = [
        selectPlato.value || null,
        selectEntrada.value || null,
        selectPostre.value || null,
        selectBebida.value || null
    ].filter(x => x);

    // suma de precios
    let total = 0;
    const stocks = [];
    ids.forEach(id => {
        const m = menus.find(x => Number(x.id) === Number(id));
        if (m && m.precio) total += Number(m.precio);
        if (m && (m.stock !== undefined && m.stock !== null)) stocks.push(Number(m.stock));
    });

    // calcular stock combo = mínimo entre stocks si hay stocks definidos
    let stockCombo = "N/A";
    if (stocks.length > 0) {
        stockCombo = Math.min(...stocks);
    }

    const descuentoPct = Number(inputDescPct.value) || 0;
    const precioFinal = Number((total * (1 - descuentoPct / 100)).toFixed(2));

    precioRealText.textContent = `S/. ${formatMoney(total)}`;
    precioFinalText.textContent = `S/. ${formatMoney(precioFinal)}`;
    stockComboText.textContent = stockCombo;

    // retornar datos por si es necesario
    return {
        precioReal: total,
        precioFinal,
        stockCombo: stockCombo === "N/A" ? null : stockCombo,
        descuentoPct
    };
}

/* ----------------- GUARDAR / EDITAR ----------------- */
form.addEventListener("submit", async e=>{
    e.preventDefault();

    // al menos 1 item seleccionado o menuId? Requerimos al menos 1 item en los selects.
    const selectedIds = {
        platoFondoId: selectPlato.value || null,
        entradaId: selectEntrada.value || null,
        postreId: selectPostre.value || null,
        bebidaId: selectBebida.value || null
    };

    if (!selectedIds.platoFondoId && !selectedIds.entradaId && !selectedIds.postreId && !selectedIds.bebidaId) {
        alert("Selecciona al menos un producto para la promoción.");
        return;
    }

    const summary = updateSummary();

    // 🚨 Función auxiliar para una conversión segura (Number o null)
    const getSafeId = (idValue) => {
        if (!idValue) return null;
        const id = Number(idValue);
        return isNaN(id) ? null : id;
    };
    
    const data = {
        titulo: inputNombre.value,
        descripcion: inputDesc.value,
        precioRealTotal: summary.precioReal,
        precioOferta: summary.precioFinal,
        descuento: summary.descuentoPct,
        fechaInicio: inputInicio.value ? (inputInicio.value + "T00:00:00") : null,
        fechaFin: inputFin.value ? (inputFin.value + "T23:59:59") : null,
        activa: inputEstado.value,
        menuId: null, // Ahora que la DB permite NULL, esto es seguro
        
        // 🚨 Usamos la función segura para convertir los IDs a números o null
        platoFondoId: getSafeId(selectedIds.platoFondoId),
        entradaId: getSafeId(selectedIds.entradaId),
        postreId: getSafeId(selectedIds.postreId),
        bebidaId: getSafeId(selectedIds.bebidaId),
        
        stockMaximo: summary.stockCombo
    };

    try {
        let res;
        if(inputId.value){
            res = await fetch(`${API_URL}/${inputId.value}`, {
                method: "PUT",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(data)
            });
        } else {
            res = await fetch(API_URL, {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(data)
            });
        }

        if (!res.ok) {
            const txt = await res.text();
            console.error("Error respuesta server:", res.status, txt);
            alert("Error del servidor al guardar la promoción. Revisa la consola.");
            return;
        }

        modal.style.display="none";
        await fetchPromotions();
    } catch(e){
        console.error("Guardar promo error:", e);
        alert("Error al conectar con el servidor.");
    }
});

/* ----------------- EDITAR ----------------- */
function openEditModal(id){
    const p = promotions.find(x => x.id === id);
    if(!p) return;

    modal.style.display="flex";
    inputId.value = p.id;
    inputNombre.value = p.titulo;
    inputDesc.value = p.descripcion;
    inputDescPct.value = p.descuento || 0;

    inputInicio.value = p.fechaInicio?.substring(0,10) || "";
    inputFin.value = p.fechaFin?.substring(0,10) || "";
    inputEstado.value = p.activa || "Activa";

    // setear selects (si existen)
    selectPlato.value = p.platoFondoId || "";
    selectEntrada.value = p.entradaId || "";
    selectPostre.value = p.postreId || "";
    selectBebida.value = p.bebidaId || "";

    // actualizar resumen
    updateSummary();
}

/* ----------------- ELIMINAR ----------------- */
async function deletePromo(id){
    if(!confirm("¿Eliminar promoción?")) return;
    try{
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) {
            console.error("Eliminar fallo:", res.status);
            alert("No se pudo eliminar la promoción (ver consola).");
            return;
        }
        fetchPromotions();
    } catch(e){
        console.error(e);
        alert("Error al conectar con el servidor.");
    }
}

/* ----------------- RENDER GLOBAL ----------------- */
function reRenderAll(){
    renderTable();
    renderCards();
    renderStats();
}

/* ----------------- INIT ----------------- */
(async ()=>{
    await fetchMenus();
    await fetchPromotions();
})();

document.addEventListener("DOMContentLoaded", () => {
    fetchMenus();
    fetchPromotions();
});
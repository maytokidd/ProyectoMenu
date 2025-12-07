// ===============================
// REFERENCIAS
// ===============================
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

// NUEVO → STOCK
const inputStockMax = document.getElementById("stockMaximo");
const stockError = document.getElementById("stockError");

// SELECTS DE COMBO
const selectPlatoFondo = document.getElementById("selectPlatoFondo");
const selectEntrada = document.getElementById("selectEntrada");
const selectPostre = document.getElementById("selectPostre");
const selectBebida = document.getElementById("selectBebida");

// RESUMEN
const precioRealText = document.getElementById("precioRealText");
const precioFinalText = document.getElementById("precioFinalText");
const stockComboText = document.getElementById("stockComboText");

const API_URL = "http://localhost:8080/api/promociones";
const API_MENUS = "http://localhost:8080/api/menus";

let promotions = [];
let menus = [];


// ===============================
// ESTADO REAL SEGÚN FECHAS
// ===============================
function getRealStatus(p) {
  const hoy = new Date();
  const inicio = new Date(p.fechaInicio);
  const fin = new Date(p.fechaFin);

  if (p.activa !== "Activa") return p.activa;
  if (hoy < inicio) return "Programada";
  if (hoy > fin) return "Expirada";
  return "Activa";
}

function renderBadgeReal(p) {
  const estado = getRealStatus(p);

  if (estado === "Activa") return `<span class="badge activa">Activa</span>`;
  if (estado === "Programada") return `<span class="badge programada">Programada</span>`;
  if (estado === "Expirada") return `<span class="badge expirada">Expirada</span>`;
  return `<span class="badge inactiva">Inactiva</span>`;
}


// ===============================
// LLENAR SELECTS POR CATEGORÍA
// ===============================
function llenarSelectsPorCategoria() {
  const reset = (sel) => sel.innerHTML = "<option value=''>-- Ninguno --</option>";

  reset(selectPlatoFondo);
  reset(selectEntrada);
  reset(selectPostre);
  reset(selectBebida);

  menus.forEach(m => {
    if (!m.categoria) return;

    const cat = m.categoria.toLowerCase();
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = `${m.nombre} (S/. ${m.precio})`;

    if (cat.includes("fondo")) selectPlatoFondo.appendChild(opt);
    else if (cat.includes("entrada")) selectEntrada.appendChild(opt);
    else if (cat.includes("postre")) selectPostre.appendChild(opt);
    else if (cat.includes("bebida")) selectBebida.appendChild(opt);
  });
}


// ===============================
// PRECIO DESDE OPTION
// ===============================
function getPrecioFromOption(option) {
  if (!option) return 0;
  const matches = option.textContent.match(/(\d+(\.\d+)?)/g);
  return matches ? Number(matches[matches.length - 1]) : 0;
}


// ===============================
// STOCK PERMITIDO
// ===============================
function calcularStockMaximoPermitido() {
  let stocks = [];

  const ids = [
    selectPlatoFondo.value,
    selectEntrada.value,
    selectPostre.value,
    selectBebida.value
  ];

  ids.forEach(id => {
    if (!id) return;
    const menu = menus.find(m => m.id == id);
    if (menu && menu.stock != null) stocks.push(menu.stock);
  });

  if (stocks.length === 0) {
    stockComboText.textContent = "N/A";
    return null;
  }

  const minimo = Math.min(...stocks);
  stockComboText.textContent = minimo;
  return minimo;
}


// ===============================
// RESUMEN: PRECIOS + STOCK
// ===============================
function calcularResumen() {
  let precioReal = 0;

  [selectPlatoFondo, selectEntrada, selectPostre, selectBebida].forEach(sel => {
    const opt = sel.options[sel.selectedIndex];
    precioReal += getPrecioFromOption(opt);
  });

  const desc = Number(inputDescPct.value || 0);
  const precioFinal = precioReal - (precioReal * (desc / 100));

  precioRealText.textContent = `S/. ${precioReal.toFixed(2)}`;
  precioFinalText.textContent = `S/. ${precioFinal.toFixed(2)}`;

  calcularStockMaximoPermitido();
}

[selectPlatoFondo, selectEntrada, selectPostre, selectBebida, inputDescPct]
  .forEach(el => {
    el.addEventListener("change", calcularResumen);
    el.addEventListener("input", calcularResumen);
  });


// ===============================
// CARGA DE MENÚS
// ===============================
async function fetchMenus() {
  const res = await fetch(API_MENUS);
  menus = await res.json();

  llenarSelectsPorCategoria();
  calcularResumen();
}


// ===============================
// CARGAR PROMOCIONES
// ===============================
async function fetchPromotions() {
  const res = await fetch(API_URL);
  promotions = await res.json();
  reRenderAll();
}


// ===============================
// TABLA
// ===============================
function renderTable() {
  tablaBody.innerHTML = "";

  promotions.forEach(p => {

    const itemsText = [
      p.platoFondoId ? "Plato Fondo" : "",
      p.entradaId ? "Entrada" : "",
      p.postreId ? "Postre" : "",
      p.bebidaId ? "Bebida" : ""
    ].filter(x => x !== "").join(", ");

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.titulo}</td>
      <td>${p.descripcion}</td>
      <td>${p.precioOferta || 0}</td>
      <td>${p.fechaInicio?.substring(0,10)} → ${p.fechaFin?.substring(0,10)}</td>
      <td>${renderBadgeReal(p)}</td>
      <td>${itemsText || "N/A"}</td>
      <td>${p.stockMaximo ?? "N/A"}</td>
      <td style="text-align:right">
          <button onclick="openEditModal(${p.id})">✏️</button>
          <button onclick="deletePromo(${p.id})">🗑</button>
      </td>
    `;

    tablaBody.appendChild(tr);
  });
}


// ===============================
// CARDS
// ===============================
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
            <small>Hasta ${p.fechaFin?.substring(0,10)}</small>
        </div>
        <div class="pct">${p.precioOferta || 0}%</div>
      `;

      cardsContainer.appendChild(card);
    });
}


// ===============================
// ESTADÍSTICAS
// ===============================
function renderStats() {
  totalPromos.textContent = promotions.length;
  activePromos.textContent = promotions.filter(p => getRealStatus(p) === "Activa").length;

  const avg = promotions.reduce((s, p) => s + (p.precioOferta || 0), 0) / (promotions.length || 1);
  avgDiscount.textContent = Math.round(avg) + "%";
}


// ===============================
// MODAL NUEVA PROMOCIÓN
// ===============================
btnAgregar.addEventListener("click", () => {
  modal.style.display = "flex";
  form.reset();
  inputId.value = "";
  stockError.style.display = "none";
  inputStockMax.classList.remove("input-error");
  calcularResumen();
});

btnCancel.onclick = () => modal.style.display = "none";
closeModal.onclick = () => modal.style.display = "none";


// ===============================
// EDITAR
// ===============================
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
  inputStockMax.value = p.stockMaximo || "";

  // RELLENAR SELECTS DEL COMBO
  selectPlatoFondo.value = p.platoFondoId || "";
  selectEntrada.value = p.entradaId || "";
  selectPostre.value = p.postreId || "";
  selectBebida.value = p.bebidaId || "";

  calcularResumen();
}


// ===============================
// GUARDAR
// ===============================
form.addEventListener("submit", async e => {
  e.preventDefault();

  const stockPermitido = calcularStockMaximoPermitido();
  const stockIngresado = Number(inputStockMax.value);

  if (stockPermitido !== null && stockIngresado > stockPermitido) {
      stockError.textContent = `Stock inválido. Máximo permitido: ${stockPermitido}`;
      stockError.style.display = "block";
      inputStockMax.classList.add("input-error");
      return;
  }

  stockError.style.display = "none";
  inputStockMax.classList.remove("input-error");

  const data = {
    titulo: inputNombre.value,
    descripcion: inputDesc.value,
    precioOferta: Number(inputDescPct.value),
    fechaInicio: inputInicio.value + "T00:00:00",
    fechaFin: inputFin.value + "T23:59:59",
    activa: inputEstado.value,
    stockMaximo: stockIngresado,

    // CAMPOS DEL COMBO
    platoFondoId: selectPlatoFondo.value ? Number(selectPlatoFondo.value) : null,
    entradaId: selectEntrada.value ? Number(selectEntrada.value) : null,
    postreId: selectPostre.value ? Number(selectPostre.value) : null,
    bebidaId: selectBebida.value ? Number(selectBebida.value) : null
  };

  try {
    const url = inputId.value ? `${API_URL}/${inputId.value}` : API_URL;
    const method = inputId.value ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    modal.style.display = "none";
    fetchPromotions();

  } catch (err) {
    console.error("Error guardando promoción:", err);
  }
});


// ===============================
// ELIMINAR
// ===============================
async function deletePromo(id) {
  if (!confirm("¿Eliminar promoción?")) return;

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchPromotions();
}


// ===============================
// RENDER GENERAL
// ===============================
function reRenderAll() {
  renderTable();
  renderCards();
  renderStats();
}


// ===============================
// INIT
// ===============================
(async () => {
  await fetchMenus();
  await fetchPromotions();
})();

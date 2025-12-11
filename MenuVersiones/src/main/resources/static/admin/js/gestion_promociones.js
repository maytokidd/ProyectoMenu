// ===============================
// REFERENCIAS
// ===============================
const tablaBody = document.getElementById("tablaBody");
const cardsContainer = document.getElementById("cardsContainer");

// Estadísticas
const totalPromos = document.getElementById("totalPromos");
const activePromos = document.getElementById("activePromos");
const scheduledPromos = document.getElementById("scheduledPromos");
const expiredPromos = document.getElementById("expiredPromos");
const avgDiscount = document.getElementById("avgDiscount");
const avgReal = document.getElementById("avgReal");
const avgOferta = document.getElementById("avgOferta");
const avgSaving = document.getElementById("avgSaving");
const totalStockPromos = document.getElementById("totalStockPromos");

// Modal
const modal = document.getElementById("modalPromocion");
const btnAgregar = document.getElementById("btnAgregar");
const btnCancel = document.getElementById("btnCancel");
const closeModal = document.getElementById("closeModal");
const form = document.getElementById("formPromocion");

// Inputs
const inputId = document.getElementById("promoId");
const inputNombre = document.getElementById("nombre");
const inputDesc = document.getElementById("descripcion");
const inputDescPct = document.getElementById("descuento");
const inputInicio = document.getElementById("fechaInicio");
const inputFin = document.getElementById("fechaFin");
const inputEstado = document.getElementById("estado");

// STOCK
const inputStockMax = document.getElementById("stockMaximo");
const stockError = document.getElementById("stockError");
const stockHint = document.getElementById("stockHint");

// SELECTS DE COMBO
const selectPlatoFondo = document.getElementById("selectPlatoFondo");
const selectEntrada = document.getElementById("selectEntrada");
const selectPostre = document.getElementById("selectPostre");
const selectBebida = document.getElementById("selectBebida");

// RESUMEN / PREVIEW
const precioRealText = document.getElementById("precioRealText");
const precioFinalText = document.getElementById("precioFinalText");
const descuentoText = document.getElementById("descuentoText");
const stockComboText = document.getElementById("stockComboText");
const previewItems = document.getElementById("previewItems");
const previewVigencia = document.getElementById("previewVigencia");

const API_URL = "http://localhost:8080/api/promociones";
const API_MENUS = "http://localhost:8080/api/menus";

let promotions = [];
let menus = [];

// ===============================
// ESTADO REAL SEGÚN FECHAS + CAMPO ACTIVA
// ===============================
function getRealStatus(p) {
  const hoy = new Date();
  const inicio = p.fechaInicio ? new Date(p.fechaInicio) : null;
  const fin = p.fechaFin ? new Date(p.fechaFin) : null;

  if (!p.activa) return "Inactiva";
  if (p.activa !== "Activa") return p.activa;

  if (inicio && hoy < inicio) return "Programada";
  if (fin && hoy > fin) return "Expirada";
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
// OBTENER PRECIO DESDE OPTION
// ===============================
function getPrecioFromOption(option) {
  if (!option) return 0;
  const matches = option.textContent.match(/(\d+(\.\d+)?)/g);
  return matches ? Number(matches[matches.length - 1]) : 0;
}

// ===============================
// OBTENER NOMBRE BONITO DESDE OPTION
// ===============================
function getNombreFromOption(option) {
  if (!option) return null;
  // Tomamos todo antes del paréntesis (S/. xx)
  return option.textContent.split("(S/.")[0].trim();
}

// ===============================
// CALCULAR PRECIO REAL (SUMA DE ITEMS)
// ===============================
function calcularPrecioReal() {
  let precioReal = 0;

  [selectPlatoFondo, selectEntrada, selectPostre, selectBebida].forEach(sel => {
    const opt = sel.options[sel.selectedIndex];
    precioReal += getPrecioFromOption(opt);
  });

  return precioReal;
}

// ===============================
// CALCULAR STOCK MÁXIMO PERMITIDO PARA EL COMBO
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
    stockHint.textContent = "Selecciona al menos un producto con stock.";
    return null;
  }

  const minimo = Math.min(...stocks);
  stockComboText.textContent = minimo;
  stockHint.textContent = `Máximo permitido según stock de los productos: ${minimo}`;
  return minimo;
}

// ===============================
// ACTUALIZAR VISTA PREVIA (items + vigencia + precios)
// ===============================
function actualizarPreview() {
  // Items
  const nombres = [];
  [selectPlatoFondo, selectEntrada, selectPostre, selectBebida].forEach(sel => {
    const opt = sel.options[sel.selectedIndex];
    const nombre = getNombreFromOption(opt);
    if (nombre) nombres.push(nombre);
  });

  previewItems.textContent = nombres.length ? nombres.join("  |  ") : "Sin seleccionar";

  // Vigencia
  if (inputInicio.value && inputFin.value) {
    previewVigencia.textContent = `${inputInicio.value} → ${inputFin.value}`;
  } else {
    previewVigencia.textContent = "-";
  }
}

// ===============================
// RESUMEN: PRECIOS + DESCUENTO + STOCK + PREVIEW
// ===============================
function calcularResumen() {
  let precioReal = calcularPrecioReal();

  let descPct = Number(inputDescPct.value || 0);
  if (descPct < 0) descPct = 0;
  if (descPct > 100) descPct = 100;
  inputDescPct.value = descPct;

  const descuentoDecimal = descPct / 100;
  const precioFinal = precioReal * (1 - descuentoDecimal);

  precioRealText.textContent = `S/. ${precioReal.toFixed(2)}`;
  precioFinalText.textContent = `S/. ${precioFinal.toFixed(2)}`;
  descuentoText.textContent = `${descPct}%`;

  calcularStockMaximoPermitido();
  actualizarPreview();
}

// Eventos para actualizar resumen
[selectPlatoFondo, selectEntrada, selectPostre, selectBebida, inputDescPct, inputInicio, inputFin]
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
// TEXTO DE ITEMS DESDE IDS (para tabla y cards)
// ===============================
function buildItemsTextFromPromo(p) {
  const arr = [];

  function pushIf(id) {
    if (!id) return;
    const m = menus.find(x => x.id === id);
    if (m) arr.push(m.nombre);
  }

  pushIf(p.platoFondoId);
  pushIf(p.entradaId);
  pushIf(p.postreId);
  pushIf(p.bebidaId);

  return arr.join("  |  ");
}

// ===============================
// TABLA
// ===============================
function renderTable() {
  tablaBody.innerHTML = "";

  promotions.forEach(p => {
    const base = p.precioRealTotal || 0;
    const oferta = p.precioOferta != null ? p.precioOferta : base;
    const descPct = p.descuento != null ? p.descuento : (
      base > 0 ? Math.round((1 - (oferta / base)) * 100) : 0
    );

    const itemsText = buildItemsTextFromPromo(p) || "N/A";

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.titulo}</td>
      <td>${p.descripcion}</td>
      <td>${descPct}%</td>
      <td>S/. ${base.toFixed(2)} → S/. ${oferta.toFixed(2)}</td>
      <td>${p.fechaInicio?.substring(0,10)} → ${p.fechaFin?.substring(0,10)}</td>
      <td>${renderBadgeReal(p)}</td>
      <td>${itemsText}</td>
      <td>${p.stockMaximo ?? "N/A"}</td>
      <td style="text-align:right">
          <button type="button" onclick="openEditModal(${p.id})">✏️</button>
          <button type="button" onclick="deletePromo(${p.id})">🗑</button>
      </td>
    `;

    tablaBody.appendChild(tr);
  });
}

// ===============================
// CARDS PROMOCIONES ACTIVAS (diseño completo)
// ===============================
function renderCards() {
  cardsContainer.innerHTML = "";

  promotions
    .filter(p => getRealStatus(p) === "Activa")
    .forEach(p => {
      const base = p.precioRealTotal || 0;
      const oferta = p.precioOferta != null ? p.precioOferta : base;
      const descPct = p.descuento != null ? p.descuento : (
        base > 0 ? Math.round((1 - (oferta / base)) * 100) : 0
      );

      const itemsText = buildItemsTextFromPromo(p);

      const card = document.createElement("div");
      card.className = "promo-card";

      card.innerHTML = `
        <div class="promo-info">
            <h4>${p.titulo}</h4>
            <p>${p.descripcion}</p>

            <p class="promo-items"><strong>Items:</strong> ${itemsText || "No registrados"}</p>

            <div class="promo-prices">
                <span class="before">S/. ${base.toFixed(2)}</span>
                <span class="after">S/. ${oferta.toFixed(2)}</span>
            </div>

            <div class="promo-extra">
              <span class="promo-date">Vigencia: ${p.fechaInicio.substring(0,10)} → ${p.fechaFin.substring(0,10)}</span>
              <span class="promo-stock">Stock: ${p.stockMaximo ?? "N/A"}</span>
            </div>
        </div>

        <div class="promo-side">
            <div class="discount">${descPct}%</div>
            <small>Descuento</small>
        </div>
      `;

      cardsContainer.appendChild(card);
    });
}

// ===============================
// ESTADÍSTICAS
// ===============================
function renderStats() {
  const total = promotions.length;
  totalPromos.textContent = total;

  const act = promotions.filter(p => getRealStatus(p) === "Activa");
  const prog = promotions.filter(p => getRealStatus(p) === "Programada");
  const exp = promotions.filter(p => getRealStatus(p) === "Expirada");

  activePromos.textContent = act.length;
  scheduledPromos.textContent = prog.length;
  expiredPromos.textContent = exp.length;

  let sumDesc = 0;
  let sumReal = 0;
  let sumOferta = 0;
  let sumSaving = 0;
  let sumStock = 0;

  promotions.forEach(p => {
    const base = p.precioRealTotal || 0;
    const oferta = p.precioOferta != null ? p.precioOferta : base;
    const descPct = p.descuento != null ? p.descuento : (
      base > 0 ? (1 - (oferta / base)) * 100 : 0
    );
    const saving = base - oferta;

    sumDesc += descPct;
    sumReal += base;
    sumOferta += oferta;
    sumSaving += saving;
    sumStock += (p.stockMaximo || 0);
  });

  const divisor = total || 1;
  const avgDescNum = sumDesc / divisor;
  const avgRealNum = sumReal / divisor;
  const avgOfertaNum = sumOferta / divisor;
  const avgSavingNum = sumSaving / divisor;

  avgDiscount.textContent = Math.round(avgDescNum) + "%";
  avgReal.textContent = "S/ " + avgRealNum.toFixed(2);
  avgOferta.textContent = "S/ " + avgOfertaNum.toFixed(2);
  avgSaving.textContent = "S/ " + avgSavingNum.toFixed(2);
  totalStockPromos.textContent = sumStock;
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
  [selectPlatoFondo, selectEntrada, selectPostre, selectBebida].forEach(sel => sel.value = "");
  inputDescPct.value = 0;
  calcularResumen();
});

btnCancel.onclick = () => (modal.style.display = "none");
closeModal.onclick = () => (modal.style.display = "none");

// ===============================
// EDITAR
// ===============================
function openEditModal(id) {
  const p = promotions.find(x => x.id === id);
  if (!p) return;

  modal.style.display = "flex";

  const base = p.precioRealTotal || 0;
  const oferta = p.precioOferta != null ? p.precioOferta : base;
  const descPct = p.descuento != null ? p.descuento : (
    base > 0 ? Math.round((1 - (oferta / base)) * 100) : 0
  );

  inputId.value = p.id;
  inputNombre.value = p.titulo;
  inputDesc.value = p.descripcion;
  inputDescPct.value = descPct;
  inputInicio.value = p.fechaInicio?.substring(0, 10);
  inputFin.value = p.fechaFin?.substring(0, 10);
  inputEstado.value = p.activa || "Activa";
  inputStockMax.value = p.stockMaximo || "";

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

  // Validar fechas
  if (!inputInicio.value || !inputFin.value) {
    alert("Debes seleccionar fecha de inicio y fin.");
    return;
  }

  const inicio = new Date(inputInicio.value);
  const fin = new Date(inputFin.value);

  if (inicio > fin) {
    alert("La fecha de inicio no puede ser mayor que la fecha de fin.");
    return;
  }

  const stockPermitido = calcularStockMaximoPermitido();
  const stockIngresado = Number(inputStockMax.value);

  if (!stockPermitido || stockPermitido <= 0) {
    stockError.textContent = "Selecciona al menos un producto con stock disponible.";
    stockError.style.display = "block";
    inputStockMax.classList.add("input-error");
    return;
  }

  if (!stockIngresado || stockIngresado <= 0) {
    stockError.textContent = "El stock para la promoción debe ser mayor a 0.";
    stockError.style.display = "block";
    inputStockMax.classList.add("input-error");
    return;
  }

  if (stockIngresado > stockPermitido) {
    stockError.textContent = `Stock inválido. Máximo permitido: ${stockPermitido}`;
    stockError.style.display = "block";
    inputStockMax.classList.add("input-error");
    return;
  }

  stockError.style.display = "none";
  inputStockMax.classList.remove("input-error");

  const precioReal = calcularPrecioReal();
  const descPct = Number(inputDescPct.value || 0);
  const precioFinal = precioReal * (1 - descPct / 100);

  const data = {
    titulo: inputNombre.value,
    descripcion: inputDesc.value,
    precioOferta: Number(precioFinal.toFixed(2)),  // precio final
    descuento: Math.round(descPct),                // porcentaje
    precioRealTotal: Number(precioReal.toFixed(2)),
    fechaInicio: inputInicio.value + "T00:00:00",
    fechaFin: inputFin.value + "T23:59:59",
    activa: inputEstado.value,
    stockMaximo: stockIngresado,
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
    await fetchPromotions();
  } catch (err) {
    console.error("Error guardando promoción:", err);
    alert("Ocurrió un error al guardar la promoción.");
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

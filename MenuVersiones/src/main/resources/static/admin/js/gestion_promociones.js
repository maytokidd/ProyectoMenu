/* Simulación de datos iniciales */
let promotions = [
  {
    id: 1,
    nombre: "Combo Estudiante",
    descripcion: "Almuerzo + Bebida + Postre",
    descuento: 15,
    inicio: "2025-10-15",
    fin: "2025-11-15",
    estado: "Activa",
    responsable: "Juan Pérez"
  },
  {
    id: 2,
    nombre: "Happy Hour",
    descripcion: "Descuento en snacks de 3pm a 5pm",
    descuento: 20,
    inicio: "2025-10-01",
    fin: "2025-12-31",
    estado: "Activa",
    responsable: "María López"
  },
  {
    id: 3,
    nombre: "Lunes Saludable",
    descripcion: "Descuento en menús saludables",
    descuento: 10,
    inicio: "2025-10-20",
    fin: "2025-11-20",
    estado: "Activa",
    responsable: "Carlos Ramírez"
  },
  {
    id: 4,
    nombre: "Black Friday UTP",
    descripcion: "Mega descuento en todos los menús",
    descuento: 30,
    inicio: "2025-11-29",
    fin: "2025-11-29",
    estado: "Programada",
    responsable: "Ana Torres"
  }
];

/* elementos */
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

/* inputs */
const inputId = document.getElementById("promoId");
const inputNombre = document.getElementById("nombre");
const inputDesc = document.getElementById("descripcion");
const inputDescPct = document.getElementById("descuento");
const inputInicio = document.getElementById("fechaInicio");
const inputFin = document.getElementById("fechaFin");
const inputEstado = document.getElementById("estado");
const inputResponsable = document.getElementById("responsable");

/* ---------- RENDER TABLA ---------- */
function renderTable(){
  tablaBody.innerHTML = "";
  promotions.forEach(p => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.descripcion}</td>
      <td><span class="pill">${p.descuento}%</span></td>
      <td>${p.inicio} → ${p.fin}</td>
      <td>${renderBadge(p.estado)}</td>
      <td>${p.responsable}</td>
      <td style="text-align:right">
        <button onclick="openEditModal(${p.id})">✏️</button>
        <button onclick="deletePromo(${p.id})">🗑</button>
      </td>
    `;
    tablaBody.appendChild(tr);
  });
}

/* BADGE */
function renderBadge(estado){
  if(estado === "Activa") return `<span class="badge activa">Activa</span>`;
  if(estado === "Programada") return `<span class="badge programada">Programada</span>`;
  return `<span class="badge inactiva">Inactiva</span>`;
}

/* ---------- RENDER TARJETAS ---------- */
function renderCards(){
  cardsContainer.innerHTML = "";

  promotions.forEach(p => {
    const card = document.createElement("div");
    card.className = "promo-card";

    card.innerHTML = `
      <div class="info">
        <h4>${p.nombre}</h4>
        <p>${p.descripcion}</p>
        <small style="color:#777">Hasta ${p.fin}</small>
      </div>

      <div class="pct">${p.descuento}%</div>
    `;

    cardsContainer.appendChild(card);
  });
}

/* ---------- RENDER STATS ---------- */
function renderStats(){
  totalPromos.textContent = promotions.length;
  activePromos.textContent = promotions.filter(p => p.estado==="Activa").length;

  const avg = promotions.reduce((s,p)=>s+p.descuento,0) / promotions.length;
  avgDiscount.textContent = Math.round(avg) + "%";
}

/* ---------- AGREGAR ---------- */
btnAgregar.addEventListener("click", () => {
  modal.style.display = "flex";
  form.reset();
  inputId.value = "";
});

/* ---------- EDITAR ---------- */
function openEditModal(id){
  const p = promotions.find(x=>x.id===id);
  if(!p) return;

  modal.style.display = "flex";

  inputId.value = p.id;
  inputNombre.value = p.nombre;
  inputDesc.value = p.descripcion;
  inputDescPct.value = p.descuento;
  inputInicio.value = p.inicio;
  inputFin.value = p.fin;
  inputEstado.value = p.estado;
  inputResponsable.value = p.responsable;
}

/* ---------- ELIMINAR ---------- */
function deletePromo(id){
  if(!confirm("¿Eliminar promoción?")) return;

  promotions = promotions.filter(p => p.id !== id);
  reRenderAll();
}

/* ---------- GUARDAR ---------- */
form.addEventListener("submit", e =>{
  e.preventDefault();

  const nuevo = {
    id: inputId.value ? Number(inputId.value) : Date.now(),
    nombre: inputNombre.value,
    descripcion: inputDesc.value,
    descuento: Number(inputDescPct.value),
    inicio: inputInicio.value,
    fin: inputFin.value,
    estado: inputEstado.value,
    responsable: inputResponsable.value
  };

  if(inputId.value){
    promotions = promotions.map(p => p.id===nuevo.id ? nuevo : p);
  } else {
    promotions.push(nuevo);
  }

  modal.style.display = "none";
  reRenderAll();
});

btnCancel.onclick = ()=> modal.style.display="none";
closeModal.onclick = ()=> modal.style.display="none";

/* RENDER GLOBAL */
function reRenderAll(){
  renderTable();
  renderCards();
  renderStats();
}

reRenderAll();

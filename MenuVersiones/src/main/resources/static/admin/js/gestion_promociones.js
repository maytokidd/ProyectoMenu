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
const modalTitulo = document.getElementById("modalTitulo");

/* render */
function renderTable(){
  tablaBody.innerHTML = "";
  promotions.forEach(p => {
    const tr = document.createElement("tr");

    const vigenciaHtml = `<div style="line-height:1.1">
      <div>${p.inicio}</div>
      <small style="color:#6b7280">a ${p.fin}</small>
    </div>`;

    tr.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.descripcion}</td>
      <td><span class="pill">${p.descuento}%</span></td>
      <td>${vigenciaHtml}</td>
      <td>${renderBadge(p.estado)}</td>
      <td>${p.responsable || "-"}</td>
      <td class="acciones-tabla">
        <button class="btn-editar" title="Editar" data-id="${p.id}">${svgEdit()}</button>
        <button class="btn-eliminar" title="Eliminar" data-id="${p.id}">${svgTrash()}</button>
      </td>
    `;
    tablaBody.appendChild(tr);
  });

  // attach events
  document.querySelectorAll(".btn-editar").forEach(b => b.addEventListener("click", e => {
    const id = Number(e.currentTarget.dataset.id);
    openEditModal(id);
  }));
  document.querySelectorAll(".btn-eliminar").forEach(b => b.addEventListener("click", e => {
    const id = Number(e.currentTarget.dataset.id);
    deletePromo(id);
  }));
}

function renderBadge(estado){
  const cls = estado === "Activa" ? "badge activa" : (estado === "Programada" ? "badge programada" : "badge inactiva");
  return `<span class="${cls}">${estado}</span>`;
}

function renderCards(){
  cardsContainer.innerHTML = "";
  promotions.filter(p => p.estado === "Activa" || p.estado === "Programada").forEach(p => {
    const div = document.createElement("div");
    div.className = "promo-card";
    div.innerHTML = `
      <div class="info">
        <h4>${p.nombre}</h4>
        <p>${p.descripcion}</p>
        <small style="color:#6b7280">Hasta: ${p.fin}</small>
      </div>
      <div class="pct">${p.descuento}%</div>
    `;
    cardsContainer.appendChild(div);
  });
}

function renderStats(){
  totalPromos.textContent = promotions.length;
  activePromos.textContent = promotions.filter(p=>p.estado==="Activa").length;
  const avg = Math.round(promotions.reduce((s,p)=>s+p.descuento,0)/promotions.length) || 0;
  avgDiscount.textContent = avg + "%";
}

/* CRUD simulada */
function openAddModal(){
  modal.style.display = "flex";
  modalTitulo.textContent = "Agregar Promoción";
  form.reset();
  inputId.value = "";
  document.querySelector(".btn-guardar").textContent = "Crear Promoción";
}

function openEditModal(id){
  const p = promotions.find(x=>x.id===id);
  if(!p) return;
  modal.style.display = "flex";
  modalTitulo.textContent = "Editar Promoción";
  inputId.value = p.id;
  inputNombre.value = p.nombre;
  inputDesc.value = p.descripcion;
  inputDescPct.value = p.descuento;
  inputInicio.value = p.inicio;
  inputFin.value = p.fin;
  inputEstado.value = p.estado;
  inputResponsable.value = p.responsable;
  document.querySelector(".btn-guardar").textContent = "Guardar Cambios";
}

function deletePromo(id){
  if(!confirm("¿Eliminar esta promoción?")) return;
  promotions = promotions.filter(p=>p.id!==id);
  reRenderAll();
}

form.addEventListener("submit", (e)=>{
  e.preventDefault();
  const id = inputId.value ? Number(inputId.value) : null;
  const nuevo = {
    id: id || (promotions.length?Math.max(...promotions.map(p=>p.id))+1:1),
    nombre: inputNombre.value.trim(),
    descripcion: inputDesc.value.trim(),
    descuento: Number(inputDescPct.value),
    inicio: inputInicio.value,
    fin: inputFin.value,
    estado: inputEstado.value,
    responsable: inputResponsable.value.trim() || "-"
  };

  if(id){
    promotions = promotions.map(p => p.id===id ? nuevo : p);
  } else {
    promotions.push(nuevo);
  }
  modal.style.display = "none";
  reRenderAll();
});

function reRenderAll(){
  renderTable();
  renderCards();
  renderStats();
}

/* helpers: SVG icons */
function svgEdit(){
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM21.41 6.34a1.996 1.996 0 0 0 0-2.82l-1.93-1.93a1.996 1.996 0 0 0-2.82 0l-1.83 1.83 4.75 4.75 1.83-1.83z" fill="#1e88e5"/></svg>`;
}
function svgTrash(){
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#e53935"/></svg>`;
}

/* modal controls */
btnAgregar.addEventListener("click", openAddModal);
btnCancel.addEventListener("click", ()=> modal.style.display="none");
closeModal.addEventListener("click", ()=> modal.style.display="none");

/* cerrar al hacer clic fuera */
window.addEventListener("click", (ev)=>{
  if(ev.target === modal) modal.style.display = "none";
});

/* init */
reRenderAll();

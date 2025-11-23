// Obtener todos los botones
const botones = document.querySelectorAll(".btn-accion");

// Modales individuales
const modalPassword = document.getElementById("modalPassword");
const modalEditar = document.getElementById("modalEditar");
const modalActividad = document.getElementById("modalActividad");

// Asignar funcionalidad a cada botón según su orden
botones[0].addEventListener("click", () => {
    modalPassword.style.display = "flex";
});

botones[1].addEventListener("click", () => {
    modalEditar.style.display = "flex";
});

botones[2].addEventListener("click", () => {
    modalActividad.style.display = "flex";
});

// Cerrar modales con cualquier botón .btn-cancelar
const botonesCancelar = document.querySelectorAll(".btn-cancelar");

botonesCancelar.forEach(btn => {
    btn.addEventListener("click", () => {
        modalPassword.style.display = "none";
        modalEditar.style.display = "none";
        modalActividad.style.display = "none";
    });
});

// Cerrar al hacer clic fuera del contenido
window.addEventListener("click", (e) => {
    if (e.target === modalPassword) modalPassword.style.display = "none";
    if (e.target === modalEditar) modalEditar.style.display = "none";
    if (e.target === modalActividad) modalActividad.style.display = "none";
});
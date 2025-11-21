document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formMenu");

  // GUARDAR
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoMenu = {
      nombre: document.getElementById("nombre").value,
      categoria: document.getElementById("categoria").value,
      precio: parseFloat(document.getElementById("precio").value),
      disponible: document.getElementById("disponible").checked,
      motivo: document.getElementById("motivo").value
    };

    const respuesta = await fetch("/api/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoMenu)
    });

    if (respuesta.ok) {
      alert("✅ Menú guardado correctamente");
      form.reset();
    } else {
      alert("❌ Error al guardar el menú");
    }
  });

  // CANCELAR
  document.querySelector(".cancelar").addEventListener("click", () => {
    if (confirm("¿Seguro que deseas cancelar?")) form.reset();
  });

});

document.addEventListener("DOMContentLoaded", async () => {

  const form = document.getElementById("formMenu");
  const btnGuardar = document.querySelector(".guardar");
  const btnCancelar = document.querySelector(".cancelar");

  const params = new URLSearchParams(window.location.search);
  const idMenu = params.get("id");

  const titulo = document.querySelector(".page-title");

  const infoCambios = document.getElementById("infoCambios");
  const fechaModSpan = document.getElementById("fechaMod");
  const responsableModSpan = document.getElementById("responsableMod");
  const labelDisponible = document.getElementById("labelDisponible");

  // Inputs
  const inputNombre = document.getElementById("nombre");
  const inputCategoria = document.getElementById("categoria");
  const inputPrecio = document.getElementById("precio");
  const inputDisponible = document.getElementById("disponible");

  // Elementos de la vista previa
  const prevNombre = document.getElementById("prevNombre");
  const prevCategoria = document.getElementById("prevCategoria");
  const prevCategoriaIcon = document.getElementById("prevCategoriaIcon");
  const prevPrecio = document.getElementById("prevPrecio");
  const prevEstado = document.getElementById("prevEstado");

  // ============================
  // Función vista previa
  // ============================
  function actualizarPreview() {
    const nombre = inputNombre.value.trim();
    const categoria = inputCategoria.value.trim();
    const precio = parseFloat(inputPrecio.value);
    const disponible = inputDisponible.checked;

    // Nombre
    prevNombre.textContent = nombre || "Nuevo plato sin nombre";

    // Categoría + icono
    if (categoria) {
      prevCategoria.textContent = categoria;
    } else {
      prevCategoria.textContent = "Sin categoría";
    }

    // Sacar solo el emoji de la categoría (primer carácter)
    if (categoria && categoria.length > 0) {
      prevCategoriaIcon.textContent = categoria.charAt(0);
    } else {
      prevCategoriaIcon.textContent = "🍽️";
    }

    // Precio
    if (!isNaN(precio)) {
      prevPrecio.textContent = "S/ " + precio.toFixed(2);
    } else {
      prevPrecio.textContent = "S/ 0.00";
    }

    // Estado
    if (disponible) {
      prevEstado.textContent = "🟢 Disponible";
      prevEstado.classList.remove("no-disponible");
      prevEstado.classList.add("disponible");
      labelDisponible.textContent = "Disponible";
    } else {
      prevEstado.textContent = "🔴 No disponible";
      prevEstado.classList.remove("disponible");
      prevEstado.classList.add("no-disponible");
      labelDisponible.textContent = "No disponible";
    }
  }

  // ============================
  // MODO EDICIÓN / CREACIÓN
  // ============================
  if (idMenu) {
    titulo.textContent = "✏ Editar Menú";
    await cargarMenuParaEditar(idMenu);
  } else {
    titulo.textContent = "🍽️ Agregar Nuevo Menú";
    if (infoCambios) infoCambios.style.display = "none";
    actualizarPreview();
  }

  // ============================
  // Cargar datos de menú (edición)
  // ============================
  async function cargarMenuParaEditar(id) {
    try {
      const resp = await fetch(`/api/menus/${id}`);
      if (!resp.ok) throw new Error("Error cargando datos");

      const menu = await resp.json();

      inputNombre.value = menu.nombre;
      inputCategoria.value = menu.categoria;
      inputPrecio.value = menu.precio;
      inputDisponible.checked = menu.disponible;

      // Mostrar info de cambios
      if (infoCambios) {
        infoCambios.style.display = "block";

        if (menu.ultimaModificacion) {
          const fecha = new Date(menu.ultimaModificacion)
            .toLocaleString("es-PE");
          fechaModSpan.textContent = fecha;
        } else if (menu.fechaCreacion) {
          const fecha = new Date(menu.fechaCreacion)
            .toLocaleString("es-PE");
          fechaModSpan.textContent = fecha;
        } else {
          fechaModSpan.textContent = "-";
        }

        responsableModSpan.textContent = menu.responsable || "Administrador";
      }

      actualizarPreview();

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar el menú."
      });
    }
  }

  // ============================
  // Eventos para vista previa
  // ============================
  inputNombre.addEventListener("input", actualizarPreview);
  inputCategoria.addEventListener("change", actualizarPreview);
  inputPrecio.addEventListener("input", actualizarPreview);
  inputDisponible.addEventListener("change", actualizarPreview);

  // ============================
  // GUARDAR O ACTUALIZAR
  // ============================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      nombre: inputNombre.value,
      categoria: inputCategoria.value,
      precio: parseFloat(inputPrecio.value),
      disponible: inputDisponible.checked
    };

    // Bloquear botón mientras se envía
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = "Guardando...";

    try {
      let url = "/api/menus";
      let metodo = "POST";

      if (idMenu) {
        url = `/api/menus/${idMenu}`;
        metodo = "PUT";
      }

      const resp = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        throw new Error("Error en el guardado");
      }

      // Toast de éxito
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: idMenu ? "Menú actualizado correctamente" : "Menú creado correctamente",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });

      // Redirigir después de un pequeño delay
      setTimeout(() => {
        window.location.href = "dashboard_admin.html";
      }, 800);

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: idMenu ? "No se pudo actualizar el menú." : "No se pudo crear el menú."
      });
    } finally {
      btnGuardar.disabled = false;
      btnGuardar.innerHTML = "💾 Guardar";
    }
  });

  // Botón cancelar
  btnCancelar.addEventListener("click", () => {
    window.location.href = "dashboard_admin.html";
  });

});

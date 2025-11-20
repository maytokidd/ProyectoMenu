document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const clave = document.getElementById("clave").value.trim();

    const divError = document.getElementById("mensajeError");
    divError.style.display = "none";

    try {
        const respuesta = await fetch("http://localhost:8080/api/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, clave })
        });

        const data = await respuesta.json();

        if (!data.exito) {
            mostrarError(data.mensaje || "Usuario o clave incorrecta");
            return;
        }

        const rol = data.rol.toLowerCase(); // convierte a minúsculas

        // Redirección según el rol enviado por el backend
        if (rol === "administrador") {
            console.log("Redirigiendo a admin");  // <- log para depuración
            window.location.href = "admin/dashboard_admin.html"; // ruta relativa desde login.html
        } else if (rol === "usuario") {
            console.log("Redirigiendo a user");  // <- log para depuración
            window.location.href = "user/dashboard_usuario.html"; // ruta relativa
        } else {
            mostrarError("Rol desconocido. Contacte a soporte.");
        }

    } catch (error) {
        mostrarError("Error de conexión con el servidor");
        console.error("ERROR FETCH LOGIN:", error);
    }
});

function mostrarError(msg) {
    const div = document.getElementById("mensajeError");
    div.innerText = msg;
    div.style.display = "block";
}
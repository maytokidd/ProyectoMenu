document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const clave = document.getElementById("clave").value;
    const rol = document.getElementById("rol").value; // "Administrador" o "Empleado"

    try {
        // Enviar datos al backend
        const respuesta = await fetch("http://localhost:8080/login-validar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, clave, rol })
        });

        const data = await respuesta.json();

        if (!data.ok) {
            mostrarError(data.mensaje);
            return;
        }

        // Redireccionar según rol
        if (rol === "Administrador") {
            window.location.href = "/admin/dashboard_admin.html";
        } else {
            window.location.href = "/user/dashboard_user.html";
        }

    } catch (error) {
        mostrarError("Error de conexión con el servidor");
        console.error("Error login:", error);
    }
});

// Función para mostrar mensaje de error
function mostrarError(msg) {
    const div = document.getElementById("mensajeError");
    div.innerText = msg;
    div.style.display = "block";
}
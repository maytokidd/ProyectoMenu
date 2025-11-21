document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const clave = document.getElementById("clave").value;


    document.getElementById("mensajeError").style.display = "none";

    try {
        const respuesta = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, clave })
        });

        const data = await respuesta.json();

        if (!data.exito) {
            mostrarError(data.mensaje || "Credenciales incorrectas");
            return;
        }

        console.log("Login exitoso. Rol:", data.rol);

        // 🔥 REDIRECCIÓN USANDO EL ROL QUE VIENE DEL BACKEND
        const rol = data.rol;

        if (rol === "ADMINISTRADOR") {
            window.location.href = "/admin/dashboard_admin.html";

        } else if (rol === "EMPLEADO") {
            window.location.href = "/user/dashboard_user.html";

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
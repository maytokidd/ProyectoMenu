document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();


    const username = document.getElementById("usuario").value; // 'usuario'
    const password = document.getElementById("clave").value;   // 'clave'
    const rol = document.getElementById("rol").value;         // 'rol'

    // Limpiar mensaje de error antes de cada intento
    document.getElementById("mensajeError").style.display = "none";
    
    if (rol === "") {
        mostrarError("Debe seleccionar un rol para ingresar.");
        return;
    }

    //  Realizar la petición POST al nuevo endpoint del Backend (AuthController.java)

    try {
        const respuesta = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },

            body: JSON.stringify({ username: username, password: password, rol: rol }) 
        });


        if (!respuesta.ok) {

            mostrarError("Error de conexión con el servidor. Revise el Backend.");
            return;
        }

        const data = await respuesta.json(); // La respuesta del AuthController


        if (data.success) {
            // Si la autenticación es exitosa, redirigir según el rol VALIDADO por el Backend
            if (data.rol === "administrador") { // Usamos 'administrador' (minúsculas) como en el Backend
                window.location.href = "/admin/dashboard_admin.html";
            } else if (data.rol === "empleado") { // Usamos 'empleado' (minúsculas) como en el Backend
                window.location.href = "/user/dashboard_user.html";
            }
        } else {

            mostrarError(data.message);
        }
    } catch (error) {

        mostrarError("No se pudo conectar con el servidor (Backend). Verifique que esté activo.");
        console.error("Fallo en fetch:", error);
    }
});

function mostrarError(msg) {
    const div = document.getElementById("mensajeError");
    div.innerText = msg;
    div.style.display = "block";
}
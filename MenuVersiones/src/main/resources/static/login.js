document.getElementById("formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const clave = document.getElementById("clave").value;
    const rol = document.getElementById("rol").value;

    const respuesta = await fetch("/login-validar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, clave, rol })
    });

    const data = await respuesta.json();

    if (!data.ok) {
        mostrarError(data.mensaje);
        return;
    }

    if (rol === "ADMIN") {
        window.location.href = "/admin/dashboard_admin.html";
    } else {
        window.location.href = "/user/dashboard_user.html";
    }
});

function mostrarError(msg) {
    const div = document.getElementById("mensajeError");
    div.innerText = msg;
    div.style.display = "block";
}

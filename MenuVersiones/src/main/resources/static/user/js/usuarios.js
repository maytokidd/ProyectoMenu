document.addEventListener("DOMContentLoaded", () => {

    // =============================
    // 1. Cargar datos del usuario
    // =============================
    fetch("/api/usuarios/mi-perfil")
        .then(r => r.json())
        .then(data => {
            if (data.error) {
                alert("No hay usuario en sesión");
                return;
            }

            const u = data.usuario;

            // Guardamos ID oculto
            document.getElementById("perfil-id").value = u.id;

            // Insertamos los valores
            document.getElementById("perfil-nombre").textContent = u.nombre;
            document.getElementById("perfil-apellido").textContent = u.apellido;
            document.getElementById("perfil-username").textContent = u.username;
            document.getElementById("perfil-email").textContent = u.email;
            document.getElementById("perfil-rol").textContent = u.rol;
            document.getElementById("perfil-estado").textContent = u.estado;

            document.getElementById("sidebar-username").textContent = u.nombre;
            document.getElementById("perfil-nombre-completo").textContent = `${u.nombre} ${u.apellido}`;
        });

    // =============================
    // 2. Abrir y cerrar modales
    // =============================
    document.querySelectorAll(".btn-accion").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-target");
            document.getElementById(id).style.display = "flex";
        });
    });

    document.querySelectorAll(".btn-cancelar").forEach(b => {
        b.addEventListener("click", () => {
            b.closest(".modal").style.display = "none";
        });
    });

    // =============================
    // 3. Cambiar contraseña
    // =============================
    document.getElementById("form-password").addEventListener("submit", e => {
        e.preventDefault();

        const id = document.getElementById("perfil-id").value;
        const nuevaPass = document.getElementById("pass-nueva").value;
        const confirmar = document.getElementById("pass-confirmar").value;

        if (nuevaPass !== confirmar) {
            alert("Las contraseñas no coinciden");
            return;
        }

        fetch(`/api/usuarios/${id}/password?nuevaPassword=${nuevaPass}`, {
            method: "PATCH"
        })
        .then(r => r.json())
        .then(() => {
            alert("Contraseña cambiada con éxito");
            document.getElementById("modalPassword").style.display = "none";
        });
    });

    // =============================
    // 4. Editar información
    // =============================
    document.getElementById("form-editar").addEventListener("submit", e => {
        e.preventDefault();

        const id = document.getElementById("perfil-id").value;

       const payload = {
    nombre: document.getElementById("edit-nombre").value,
    apellido: document.getElementById("edit-apellido").value,
    email: document.getElementById("edit-email").value
}

        fetch(`/api/usuarios/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(r => r.json())
        .then(() => {
            alert("Datos actualizados correctamente");
            location.reload(); // refresca la vista
        });
    });

});

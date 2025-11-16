document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("http://localhost:8080/menus");
    const menus = await res.json();

    const tabla = document.getElementById("tablaMenus");
    const buscar = document.getElementById("buscar");

    function mostrar() {
        const texto = buscar.value.toLowerCase();
        tabla.innerHTML = "";

        menus
            .filter(m => m.nombre.toLowerCase().includes(texto))
            .forEach(m => {
                tabla.innerHTML += `
                    <tr>
                        <td>${m.nombre}</td>
                        <td>${m.categoria}</td>
                        <td>S/ ${m.precio.toFixed(2)}</td>
                        <td>${m.disponible ? "Disponible" : "No Disponible"}</td>
                    </tr>
                `;
            });
    }

    mostrar();
    buscar.addEventListener("input", mostrar);
});

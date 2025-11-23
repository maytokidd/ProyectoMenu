document.addEventListener("DOMContentLoaded", () => {

    cargarProductos();
    cargarVentas();

    const cantidadInput = document.getElementById("cantidad");
    const precioInput = document.getElementById("precio");
    const totalInput = document.getElementById("total");
    const productoSelect = document.getElementById("productoSelect");

    productoSelect.addEventListener("change", actualizarPrecio);
    cantidadInput.addEventListener("input", calcularTotal);

    document.getElementById("ventaForm").addEventListener("submit", (e) => {
        e.preventDefault();
        registrarVenta();
    });

    function cargarProductos() {
        fetch("/api/menus")
            .then(res => res.json())
            .then(data => {

                const select = document.getElementById("productoSelect");
                select.innerHTML = ""; // limpiar antes de cargar

                data.forEach(menu => {
                    const option = document.createElement("option");
                    option.value = menu.id;
                    option.textContent = menu.nombre;
                    option.dataset.precio = menu.precio;
                    select.appendChild(option);
                });

                actualizarPrecio();
            })
            .catch(error => {
                console.error("Error cargando menús:", error);
            });
    }

    function actualizarPrecio() {
        const selected = productoSelect.selectedOptions[0];
        precioInput.value = selected.dataset.precio || 0;
        calcularTotal();
    }

    function calcularTotal() {
        totalInput.value = (cantidadInput.value * precioInput.value).toFixed(2);
    }




function registrarVenta() {
    const selected = productoSelect.selectedOptions[0];

    const venta = {
        menuId: parseInt(selected.value),
        menuNombre: selected.textContent,
        cantidad: parseInt(cantidadInput.value),
        precioUnitario: parseFloat(precioInput.value),
        total: parseFloat(totalInput.value),
        empleado: "Empleado" // si quieres guardarlo
    };

    fetch("/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venta)
    })
    .then(res => res.json())
    .then(() => {
        alert("Venta registrada correctamente");
        cargarVentas();
    });
}





    function cargarVentas() {
        fetch("/api/ventas")
            .then(res => res.json())
            .then(data => {
                const tbody = document.getElementById("ventasTableBody");
                tbody.innerHTML = "";

                data.forEach(v => {
    const row = `
        <tr>
            <td>${v.id}</td>
            <td>${v.menuNombre}</td>
            <td>${v.cantidad}</td>
            <td>S/. ${v.total.toFixed(2)}</td>
            <td>${v.fechaVenta}</td>
        </tr>
    `;
    tbody.innerHTML += row;
});

            });
    }

});  // 🔥 ESTA LLAVE FALTABA

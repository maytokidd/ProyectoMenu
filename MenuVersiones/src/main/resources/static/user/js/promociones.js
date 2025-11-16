document.addEventListener("DOMContentLoaded", async () => {
    const res = await fetch("http://localhost:8080/promociones");
    const promos = await res.json();

    const cont = document.getElementById("promoList");
    cont.innerHTML = "";

    promos.forEach(p => {
        cont.innerHTML += `
            <div class="promo-card">
                <h3>${p.titulo}</h3>
                <p>${p.descripcion}</p>
                <p><strong>Descuento:</strong> ${p.descuento}%</p>
            </div>
        `;
    });
});

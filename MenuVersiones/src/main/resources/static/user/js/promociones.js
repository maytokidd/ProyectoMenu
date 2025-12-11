document.addEventListener("DOMContentLoaded", async () => {
    const promoList = document.getElementById("promoList");
    const loader = document.getElementById("loader");
    
    let menus = [];
    let promociones = [];

    loader.style.display = "block";

    try {
        // 1. Cargar Menús y Promociones en paralelo
        const [resMenus, resPromos] = await Promise.all([
            fetch("/api/menus"),
            fetch("http://localhost:8080/api/promociones/activas") // Usamos el endpoint filtrado del backend
        ]);

        menus = await resMenus.json();
        promociones = await resPromos.json();

        renderPromociones();

    } catch (error) {
        console.error("Error cargando datos:", error);
        promoList.innerHTML = `<p style="color:red">Error cargando promociones.</p>`;
    } finally {
        loader.style.display = "none";
    }

    // 2. Función auxiliar para obtener nombres de los items
    function getNombresItems(promo) {
        const ids = [promo.platoFondoId, promo.entradaId, promo.postreId, promo.bebidaId];
        const nombres = [];

        ids.forEach(id => {
            if (id) {
                const menu = menus.find(m => m.id === id);
                if (menu) nombres.push(menu.nombre);
            }
        });
        return nombres.length > 0 ? nombres.join(" + ") : "Combo sorpresa";
    }

    // 3. Renderizar Cards Estilo Admin
    function renderPromociones() {
        promoList.innerHTML = "";

        if (promociones.length === 0) {
            promoList.innerHTML = "<p>No hay promociones activas hoy.</p>";
            return;
        }

        promociones.forEach(p => {
            const itemsTexto = getNombresItems(p);
            
            // Calculo visual de ahorro si no viene del back
            const precioNormal = p.precioRealTotal || p.precioOferta; // Fallback
            const ahorro = (precioNormal - p.precioOferta).toFixed(2);

            // Crear Card
            const card = document.createElement("div");
            // Estilos directos para emular el admin dashboard sin crear otro CSS
            card.style.cssText = `
                background: white; 
                border-radius: 12px; 
                padding: 20px; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
                border-left: 5px solid #ff5252;
                display: flex; 
                flex-direction: column; 
                justify-content: space-between;
                transition: transform 0.2s;
            `;
            
            card.onmouseover = () => card.style.transform = "translateY(-5px)";
            card.onmouseout = () => card.style.transform = "translateY(0)";

            card.innerHTML = `
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:start;">
                        <h3 style="margin:0; font-size:18px; color:#2c3e50;">${p.titulo}</h3>
                        <span style="background:#ff5252; color:white; padding:4px 8px; border-radius:8px; font-size:12px; font-weight:bold;">
                            -${p.descuento}%
                        </span>
                    </div>
                    
                    <p style="color:#7f8c8d; font-size:14px; margin: 8px 0;">${p.descripcion}</p>
                    
                    <div style="background:#f8f9fa; padding:8px; border-radius:6px; font-size:13px; color:#555; margin-bottom:12px;">
                        <strong>Incluye:</strong><br>
                        ${itemsTexto}
                    </div>
                </div>

                <div style="border-top:1px dashed #eee; padding-top:10px; margin-top:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <span style="text-decoration:line-through; color:#aaa; font-size:13px;">S/ ${precioNormal.toFixed(2)}</span>
                            <div style="font-size:22px; font-weight:bold; color:#27ae60;">S/ ${p.precioOferta.toFixed(2)}</div>
                        </div>
                        <div style="text-align:right;">
                             <span style="display:block; font-size:12px; color:#888;">Stock: <strong>${p.stockMaximo}</strong></span>
                             <span style="font-size:11px; color:#2980b9;">Ahorras S/ ${ahorro}</span>
                        </div>
                    </div>
                </div>
                <div>
                </div>

            <div style="border-top:1px dashed #eee; padding-top:10px; margin-top:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        </div>
                    <div style="text-align:right;">
                         
                         <a href="ventas_user.html?menuId=${p.id}&tipo=PROMOCION" 
                            style="background:#2ecc71; color:white; padding:6px 10px; border-radius:6px; text-decoration:none; font-size:13px; margin-top:8px; display:inline-block;">
                            💵 Vender Combo
                         </a>
                         </div>
                </div>
            </div>
            `;

            promoList.appendChild(card);
        });
    }
});
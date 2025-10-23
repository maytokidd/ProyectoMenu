document.getElementById('loginForm').addEventListener('submit', function(event) {
    // 1. Prevenir el envío estándar del formulario
    event.preventDefault(); 

    // 2. Obtener los valores del formulario
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Ocultar mensajes de error anteriores
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    // 3. Crear el objeto de datos para enviar
    const credentials = {
        username: username,
        password: password,
        role: role
    };

    // DEBUG: Muestra los datos que se enviarán
    console.log("Datos listos para ser enviados al servidor (Backend Java):", credentials);
    
    // 4. Lógica de Envío al Servidor (Backend)
    // *********************************************************************************
    // ** AVISO: NECESITAS REEMPLAZAR 'URL_DEL_ENDPOINT_DE_LOGIN' CON TU URL REAL **
    // *********************************************************************************
    const loginEndpointUrl = '/api/auth/login'; // Ejemplo: debe coincidir con tu @PostMapping en Spring

    fetch(loginEndpointUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
    .then(response => {
        // Maneja la respuesta. El backend debe enviar un código 200 si es exitoso
        if (response.ok) { 
            // Si el login es exitoso, sigue la redirección que envía el servidor
            return response.json(); // O simplemente .text() si el backend no devuelve JSON
        }
        
        // Si hay un error (ej. 401 Unauthorized), captúralo
        return response.json().then(errorData => {
            throw new Error(errorData.message || 'Credenciales inválidas o error del servidor.');
        });
    })
    .then(data => {
        // Si el backend es exitoso y devuelve data (ej. token, usuario) o ya redirigió
        console.log("Respuesta Exitosa del Servidor:", data);
        
        // NOTA: La redirección a /admin/dashboard.html o /employee/home.html 
        // debe ser manejada por el controlador de Spring después de la autenticación.
        
    })
    .catch(error => {
        // Muestra el error de autenticación devuelto por el servidor o el error de red
        console.error('Error durante el inicio de sesión:', error);
        
        // Muestra el mensaje de error al usuario en el HTML
        errorMessage.textContent = error.message || 'Error de conexión. Inténtalo de nuevo.';
        errorMessage.style.display = 'block';
    });
});
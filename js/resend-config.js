// Configuración para usar la API route de Vercel
const API_ENDPOINT = '/api/send-email';

// Función para enviar email usando nuestra API route
async function sendEmail(formData) {
  try {
    console.log('=== INICIO ENVÍO EMAIL ===');
    console.log('API Endpoint:', API_ENDPOINT);
    console.log('Datos del formulario:', formData);
    
    // Preparar datos para enviar a nuestra API
    const requestData = {
      nombre: formData.nombre,
      email: formData.correo,
      telefono: formData.telefono || '',
      mensaje: formData.mensaje
    };

    console.log('Datos preparados para la API:', requestData);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    };

    console.log('Opciones de la petición:', {
      method: requestOptions.method,
      headers: requestOptions.headers,
      bodyLength: requestOptions.body.length
    });

    console.log('Enviando petición a nuestra API...');
    const response = await fetch(API_ENDPOINT, requestOptions);

    console.log('Respuesta recibida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response body:', errorData);
      throw new Error(`Error HTTP: ${response.status} - ${errorData.error || errorData.message}`);
    }

    const result = await response.json();
    console.log('Respuesta exitosa:', result);
    console.log('=== FIN ENVÍO EMAIL (ÉXITO) ===');
    return { success: true, data: result };
  } catch (error) {
    console.error('=== ERROR EN ENVÍO EMAIL ===');
    console.error('Tipo de error:', error.constructor.name);
    console.error('Mensaje de error:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('=== FIN ERROR ===');
    return { success: false, error: error.message };
  }
}

// Función para probar la conectividad con nuestra API
async function testApiConnection() {
  console.log('=== PRUEBA DE CONECTIVIDAD API ===');
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: 'Prueba',
        email: 'prueba@test.com',
        telefono: '123456789',
        mensaje: 'Esta es una prueba de conectividad con la API.'
      })
    });

    console.log('Estado de la respuesta:', response.status, response.statusText);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Prueba exitosa:', result);
      return true;
    } else {
      const errorData = await response.json();
      console.error('Error en la prueba:', errorData);
      return false;
    }
  } catch (error) {
    console.error('Error de conectividad:', error);
    return false;
  }
}

// Ejecutar prueba al cargar la página
window.addEventListener('load', () => {
  console.log('Página cargada, probando conectividad con la API...');
  testApiConnection();
}); 
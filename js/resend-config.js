// Configuración de Resend API
const RESEND_API_KEY = 're_fH98SHgB_HCM3EBh6XDVtmoD41TdEEtkg';
const RESEND_API_URL = 'https://api.resend.com/emails';

// Función para enviar email usando Resend
async function sendEmail(formData) {
  try {
    console.log('=== INICIO ENVÍO EMAIL ===');
    console.log('API Key:', RESEND_API_KEY.substring(0, 10) + '...');
    console.log('URL:', RESEND_API_URL);
    console.log('Datos del formulario:', formData);
    
    const emailData = {
      from: 'Iron Paradise <onboarding@resend.dev>',
      to: ['sebastiansch.dev@gmail.com'],
      subject: `Nuevo mensaje de contacto - ${formData.nombre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D0021A;">Nuevo Mensaje de Contacto</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Nombre:</strong> ${formData.nombre}</p>
            <p><strong>Email:</strong> ${formData.correo}</p>
            <p><strong>Mensaje:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
              ${formData.mensaje.replace(/\n/g, '<br>')}
            </div>
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>Este mensaje fue enviado desde el formulario de contacto de Iron Paradise.</p>
            <p>Fecha: ${new Date().toLocaleString('es-CL')}</p>
          </div>
        </div>
      `
    };

    console.log('Datos del email preparados:', {
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject,
      htmlLength: emailData.html.length
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    };

    console.log('Opciones de la petición:', {
      method: requestOptions.method,
      headers: requestOptions.headers,
      bodyLength: requestOptions.body.length
    });

    console.log('Enviando petición a Resend...');
    const response = await fetch(RESEND_API_URL, requestOptions);

    console.log('Respuesta recibida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
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

// Función para probar la conectividad con Resend
async function testResendConnection() {
  console.log('=== PRUEBA DE CONECTIVIDAD RESEND ===');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Iron Paradise <onboarding@resend.dev>',
        to: ['sebastiansch.dev@gmail.com'],
        subject: 'Prueba de conectividad - Iron Paradise',
        html: '<p>Esta es una prueba de conectividad con la API de Resend.</p>'
      })
    });

    console.log('Estado de la respuesta:', response.status, response.statusText);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Prueba exitosa:', result);
      return true;
    } else {
      const errorText = await response.text();
      console.error('Error en la prueba:', errorText);
      return false;
    }
  } catch (error) {
    console.error('Error de conectividad:', error);
    return false;
  }
}

// Ejecutar prueba al cargar la página
window.addEventListener('load', () => {
  console.log('Página cargada, probando conectividad con Resend...');
  testResendConnection();
}); 
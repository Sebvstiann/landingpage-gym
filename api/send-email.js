import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { nombre, email, telefono, mensaje } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos: nombre, email y mensaje' 
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Formato de email inválido' 
      });
    }

    // Preparar datos del email
    const emailData = {
      from: 'Iron Paradise <noreply@ironparadise.com>',
      to: ['sebastiansch.dev@gmail.com'], // Cambia por tu email real
      subject: `Nuevo mensaje de ${nombre} - Iron Paradise`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #ff6b35; padding-bottom: 10px;">
            Nuevo Mensaje de Contacto - Iron Paradise
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #ff6b35; margin-top: 0;">Información del Cliente:</h3>
            <p><strong>Nombre:</strong> ${nombre}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${telefono ? `<p><strong>Teléfono:</strong> ${telefono}</p>` : ''}
          </div>
          
          <div style="background-color: #fff; padding: 20px; border-left: 4px solid #ff6b35; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6; color: #555;">${mensaje}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 14px;">
              Este mensaje fue enviado desde el formulario de contacto de Iron Paradise
            </p>
            <p style="color: #888; font-size: 12px;">
              Fecha: ${new Date().toLocaleString('es-ES')}
            </p>
          </div>
        </div>
      `
    };

    // Enviar email usando Resend
    const data = await resend.emails.send(emailData);

    // Respuesta exitosa
    res.status(200).json({ 
      success: true, 
      message: 'Email enviado correctamente',
      data: data
    });

  } catch (error) {
    console.error('Error al enviar email:', error);
    
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
} 
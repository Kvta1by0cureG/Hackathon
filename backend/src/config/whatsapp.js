// backend/src/config/whatsapp.js
import { config } from './env.js';

const API_URL = `https://graph.facebook.com/${config.whatsapp.apiVersion}`;
const HEADERS = {
  'Authorization': `Bearer ${config.whatsapp.token}`,
  'Content-Type': 'application/json'
};

async function llamarWhatsAppApi(ruta, datos) {
  try {
    const respuesta = await fetch(`${API_URL}/${config.whatsapp.phoneId}${ruta}`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(datos)
    });
    const json = await respuesta.json();

    if (!respuesta.ok) {
      console.error('⚠️ Meta respondió con error:', json);
      throw new Error(json.error?.message || 'Error en WhatsApp API');
    }
    return json;
  } catch (error) {
    console.error('❌ Error llamando a WhatsApp API:', error.message);
    throw error;
  }
}

// Texto simple
export function enviarMensajeTexto(para, texto) {
  return llamarWhatsAppApi('/messages', {
    messaging_product: 'whatsapp',
    to: para,
    type: 'text',
    text: { body: texto }
  });
}

// Plantilla aprobada por Meta
export function enviarPlantilla(para, nombrePlantilla, parametros = []) {
  return llamarWhatsAppApi('/messages', {
    messaging_product: 'whatsapp',
    to: para,
    type: 'template',
    template: {
      name: nombrePlantilla,
      language: { code: 'es' },
      components: [{
        type: 'body',
        parameters: parametros.map(p => ({ type: 'text', text: p }))
      }]
    }
  });
}

// Botón con URL (aquí va el link de tu Mini WebApp con token)
export function enviarBotonConUrl(para, texto, textoBoton, url) {
  return llamarWhatsAppApi('/messages', {
    messaging_product: 'whatsapp',
    to: para,
    type: 'interactive',
    interactive: {
      type: 'cta_url',
      body: { text: texto },
      action: {
        name: 'cta_url',
        parameters: { display_text: textoBoton, url: url }
      }
    }
  });
}
import { config } from '../config/env.js';
import { getUserScore } from './tools/getUserScore.js';
import { getCatalogByFloor } from './tools/getCatalogByFloor.js';
import { updateScore } from './tools/updateScore.js';
import { enviarTexto, crearTokenSesion, enviarBotonWebApp } from './whatsapp.js';

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'getUserScore',
      description: 'Obtiene el score, piso y datos del usuario actual.',
      parameters: { type: 'object', properties: {}, required: [] }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getCatalogByFloor',
      description: 'Devuelve el catálogo activo de un piso/nivel.',
      parameters: {
        type: 'object',
        properties: {
          floor: { type: 'integer', description: 'Número de piso/nivel' }
        },
        required: ['floor']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'updateScore',
      description: 'Suma o resta puntos al score del usuario actual.',
      parameters: {
        type: 'object',
        properties: {
          puntos: { type: 'integer', description: 'Puntos a sumar (puede ser negativo)' },
          motivo: { type: 'string', description: 'Motivo del cambio' }
        },
        required: ['puntos']
      }
    }
  }
];

async function ejecutarTool(nombre, args, user) {
  switch (nombre) {
    case 'getUserScore':
      return await getUserScore({ userId: user._id });
    case 'getCatalogByFloor':
      return await getCatalogByFloor({ floor: args.floor || user.floor });
    case 'updateScore':
      return await updateScore({ userId: user._id, puntos: args.puntos });
    default:
      return { error: `Herramienta ${nombre} no implementada` };
  }
}

async function llamarLLM(messages) {
  const url = `${config.llm.baseUrl}/chat/completions`;

  const respuesta = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.llm.apiKey}`
    },
    body: JSON.stringify({
      model: config.llm.model,
      messages,
      tools: TOOLS,
      tool_choice: 'auto'
    })
  });

  if (!respuesta.ok) {
    const error = await respuesta.text();
    throw new Error(`LLM error: ${respuesta.status} ${error}`);
  }

  return await respuesta.json();
}

export async function handleMessage({ user, text, phone }) {
  const system = `Eres un asistente de WhatsApp para una tienda por pisos.
Responde en español, breve y amable.
Puedes consultar score, catálogo y actualizar score usando las herramientas.
Si el usuario pide ver su panel, envía el botón con token.`;

  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: text }
  ];

  try {
    for (let i = 0; i < 5; i++) {
      const completion = await llamarLLM(messages);
      const eleccion = completion.choices?.[0]?.message;

      if (!eleccion) break;

      messages.push(eleccion);

      if (eleccion.tool_calls && eleccion.tool_calls.length > 0) {
        for (const toolCall of eleccion.tool_calls) {
          const nombre = toolCall.function.name;
          const args = JSON.parse(toolCall.function.arguments || '{}');
          const resultado = await ejecutarTool(nombre, args, user);

          messages.push({
            role: 'tool',
            tool_call_id: toolCall.id,
            content: JSON.stringify(resultado)
          });
        }
        continue;
      }

      const respuestaTexto = eleccion.content || 'No pude generar respuesta.';
      await enviarTexto(phone, respuestaTexto);
      return respuestaTexto;
    }
  } catch (error) {
    console.error('Error en agente LLM:', error.message);
    const respuesta = await fallback(user, text);
    if (respuesta) await enviarTexto(phone, respuesta);
    return respuesta;
  }
}

async function fallback(user, text) {
  const t = text.toLowerCase();

  if (t.includes('score') || t.includes('puntos')) {
    const data = await getUserScore({ userId: user._id });
    return `Tu score es ${data.score} y estás en el piso ${data.floor}.`;
  }

  if (t.includes('catálogo') || t.includes('catalogo') || t.includes('productos')) {
    const data = await getCatalogByFloor({ floor: user.floor });
    if (!data.items.length) return `No hay productos en el piso ${user.floor}.`;
    return data.items.map(i => `• ${i.name} - $${i.price}`).join('\n');
  }

  if (t.includes('panel') || t.includes('web')) {
    const token = await crearTokenSesion(user._id);
    await enviarBotonWebApp(user.phone, 'Abre tu panel aquí:', token);
    return null;
  }

  return 'No entendí. Escribe "score", "catálogo" o "panel".';
}
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { Session } from '../models/Session.js';
import {
  enviarMensajeTexto,
  enviarBotonConUrl,
  enviarPlantilla
} from '../config/whatsapp.js';

export async function crearTokenSesion(userId) {
  const token = jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await Session.create({ token, userId, expiresAt, used: false });

  return token;
}

export async function enviarTexto(telefono, texto) {
  return enviarMensajeTexto(telefono, texto);
}

export async function enviarBotonWebApp(telefono, texto, token) {
  const baseUrl = process.env.WEBAPP_URL || 'http://localhost:5173';
  const url = `${baseUrl}/?token=${encodeURIComponent(token)}`;
  return enviarBotonConUrl(telefono, texto, 'Abrir mi panel', url);
}

export async function enviarPlantillaProactiva(telefono, nombre, parametros) {
  return enviarPlantilla(telefono, nombre, parametros);
}
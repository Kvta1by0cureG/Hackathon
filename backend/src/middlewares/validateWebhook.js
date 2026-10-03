// backend/src/middlewares/validateWebhook.js
import crypto from 'crypto';
import { config } from '../config/env.js';

// GET: Meta verifica tu webhook al configurarlo
export function verificarWebhook(req, res, next) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.whatsapp.verifyToken) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
}

// POST: valida la firma X-Hub-Signature-256 de Meta
export function validarFirmaWebhook(req, res, next) {
  const firmaRecibida = req.headers['x-hub-signature-256'] || '';
  const appSecret = process.env.WHATSAPP_APP_SECRET;

  if (!appSecret) {
    console.error('❌ Falta WHATSAPP_APP_SECRET en el .env');
    return res.sendStatus(500);
  }

  const firmaCalculada = 'sha256=' + crypto
    .createHmac('sha256', appSecret)
    .update(req.rawBody) // body crudo, NO el JSON parseado
    .digest('hex');

  const valida = crypto.timingSafeEqual(
    Buffer.from(firmaRecibida),
    Buffer.from(firmaCalculada)
  );

  if (!valida) {
    console.error('⚠️ Firma de webhook inválida. Posible ataque.');
    return res.sendStatus(403);
  }
  next();
}
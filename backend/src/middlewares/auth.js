// backend/src/middlewares/auth.js
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

// Valida el token de sesión que llega desde la Mini WebApp
export function autenticarWebApp(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : req.query.token;

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret);
    req.userId = payload.userId; // disponible para las rutas
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}
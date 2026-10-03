import express from 'express';
import { autenticarWebApp } from '../middlewares/auth.js';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import { Catalog } from '../models/Catalog.js';
import { calcularPiso } from '../services/score.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ ok: true, service: 'whatsapp-agent-backend' });
});

router.get('/session', autenticarWebApp, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const floor = user.floor || calcularPiso(user.score);
    const catalog = await Catalog.find({ floor, active: true }).lean();

    res.json({ user: { ...user, floor }, catalog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.get('/catalog', autenticarWebApp, async (req, res) => {
  try {
    const floor = Number(req.query.floor);
    if (!floor) return res.status(400).json({ error: 'floor requerido' });

    const items = await Catalog.find({ floor, active: true }).lean();
    res.json({ floor, items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
});

router.post('/session/use', autenticarWebApp, async (req, res) => {
  try {
    await Session.updateOne({ token: req.token }, { used: true });
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
});

export default router;
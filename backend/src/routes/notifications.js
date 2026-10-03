import express from 'express';
import { autenticarWebApp } from '../middlewares/auth.js';
import { enviarPlantillaProactiva } from '../services/whatsapp.js';

const router = express.Router();

router.post('/send', autenticarWebApp, async (req, res) => {
  try {
    const { telefono, plantilla, parametros = [] } = req.body;

    if (!telefono || !plantilla) {
      return res.status(400).json({ error: 'telefono y plantilla requeridos' });
    }

    const resultado = await enviarPlantillaProactiva(telefono, plantilla, parametros);
    res.json({ ok: true, resultado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error enviando notificación' });
  }
});

export default router;
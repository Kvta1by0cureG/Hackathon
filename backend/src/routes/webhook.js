import express from 'express';
import { verificarWebhook, validarFirmaWebhook } from '../middlewares/validateWebhook.js';
import { User } from '../models/User.js';
import { handleMessage } from '../services/agent.js';

const router = express.Router();

router.get('/', verificarWebhook);

router.post('/', validarFirmaWebhook, async (req, res) => {
  try {
    const body = req.body;

    if (body.object !== 'whatsapp_business_account') {
      return res.sendStatus(404);
    }

    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];

    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message.text?.body || message.button?.text || '';
    const contact = value?.contacts?.[0];
    const name = contact?.profile?.name || '';

    let user = await User.findOne({ phone: from });

    if (!user) {
      user = await User.create({ phone: from, name });
    } else if (name && !user.name) {
      user.name = name;
    }

    user.lastMessageAt = new Date();
    await user.save();

    await handleMessage({ user, text, phone: from });

    res.sendStatus(200);
  } catch (error) {
    console.error('Error en webhook:', error);
    res.sendStatus(500);
  }
});

export default router;
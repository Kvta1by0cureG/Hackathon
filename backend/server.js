import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { conectarDatabase } from './config/database.js';
import webhookRouter from './routes/webhook.js';
import apiRouter from './routes/api.js';
import notificationsRouter from './routes/notifications.js';

const app = express();

app.use(cors());

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.use('/webhook', webhookRouter);
app.use('/api', apiRouter);
app.use('/api/notifications', notificationsRouter);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'WhatsApp Agent Backend' });
});

app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

async function start() {
  await conectarDatabase();

  app.listen(config.port, () => {
    console.log(`Servidor listo en http://localhost:${config.port}`);
  });
}

start().catch((error) => {
  console.error('Error fatal al arrancar:', error);
  process.exit(1);
});
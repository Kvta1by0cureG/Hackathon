// backend/src/config/database.js
import mongoose from 'mongoose';
import { config } from './env.js';

export async function conectarDatabase() {
  try {
    await mongoose.connect(config.db.url, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Base de datos conectada');
  } catch (error) {
    console.error('❌ Error de conexión a la BD:', error.message);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Conexión a la BD perdida. Reconectando...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ Reconexión exitosa a la BD');
});

export { mongoose };
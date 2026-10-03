// backend/src/config/env.js
import dotenv from 'dotenv';
dotenv.config();

const required = [
  'WHATSAPP_TOKEN',
  'WHATSAPP_PHONE_ID',
  'WHATSAPP_VERIFY_TOKEN',
  'LLM_API_KEY',
  'DATABASE_URL'
];

for (const name of required) {
  if (!process.env[name]) {
    console.error(`❌ Falta ${name} en el .env`);
    process.exit(1);
  }
}

export const config = {
  whatsapp: {
    token:       process.env.WHATSAPP_TOKEN,
    phoneId:     process.env.WHATSAPP_PHONE_ID,
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
    apiVersion:  process.env.WHATSAPP_API_VERSION || 'v21.0'
  },
  llm: {
    apiKey: process.env.LLM_API_KEY,
    model:  process.env.LLM_MODEL || 'gpt-4o-mini'
  },
  db: {
    url: process.env.DATABASE_URL
  },
  jwt: {
    secret:    process.env.JWT_SECRET || 'cambia-esto-en-produccion',
    expiresIn: process.env.JWT_EXPIRES || '15m'
  },
  port: process.env.PORT || 3000
};
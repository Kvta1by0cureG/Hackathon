
# WhatsApp Agent App

MVP: agente de IA en WhatsApp + Mini WebApp por niveles.

## Requisitos
- Node.js 18+
- MongoDB (local o Atlas free)
- Cuenta Meta for Developers con WhatsApp Cloud API
- ngrok (para exponer webhook en desarrollo)

## Setup rápido

### 1. Backend
cd backend
npm install
cp .env.example .env
# Rellena credenciales
npm run seed     # carga catálogo de prueba
npm run dev

### 2. WebApp
cd webapp
npm install
npm run dev

### 3. Exponer webhook
ngrok http 3000
# Copia la URL https y pégala en Meta > WhatsApp > Configuration

## Variables de entorno clave

Ver `backend/.env.example`.

## Flujo
1. Usuario escribe a WhatsApp
2. Webhook recibe → agente LLM → tools → DB
3. Si pide panel → recibe link con token JWT
4. Abre Mini WebApp en navegador interno de WhatsApp
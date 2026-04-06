# Abmolist

Aplicacion de tareas full stack con React + Vite en el frontend, Express + MongoDB Atlas en el backend y autenticacion con Firebase.

## Arquitectura

- `client/`: interfaz React con autenticacion mediante Firebase.
- `server/`: API Express que valida el ID token de Firebase antes de leer o escribir tareas en MongoDB Atlas.

Cada tarea queda asociada al `uid` del usuario autenticado, asi que cada sesion ve solamente sus propios datos.

## Requisitos

- Node.js 20 o superior
- Cuenta en Firebase con Authentication habilitado
- Proyecto en MongoDB Atlas y cadena `MONGODB_URI`
- Credenciales de servicio de Firebase para verificar tokens en el backend

## Variables de entorno

Frontend en `client/.env`:

```env
VITE_API_URL=http://localhost:4000/api
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

Backend en `server/.env`:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/abmolist?retryWrites=true&w=majority
FIREBASE_PROJECT_ID=tu_proyecto
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu_proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_CLAVE\n-----END PRIVATE KEY-----\n"
```

## Puesta en marcha

1. Instala dependencias con `npm install`.
2. Completa los archivos `.env` en `client/` y `server/`.
3. Arranca frontend y backend juntos con `npm run dev`.

Si prefieres ejecutar cada parte por separado:

- `npm run dev:server`
- `npm run dev:client`

## Checks utiles

- `npm run lint`
- `npm run build`
- `npm run test:server`

## Endpoints principales

- `GET /api/health`
- `GET /api/todos`
- `POST /api/todos`
- `PATCH /api/todos/:id`
- `DELETE /api/todos/:id`

Todos los endpoints de tareas requieren `Authorization: Bearer <firebase-id-token>`.

const requiredEnvKeys = [
  "MONGODB_URI",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY"
];

export function getServerConfig() {
  return {
    port: Number(process.env.PORT || 4000),
    clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
  };
}

export function validateServerEnv() {
  const missingKeys = requiredEnvKeys.filter((key) => !process.env[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Faltan variables de entorno del backend: ${missingKeys.join(", ")}.`
    );
  }
}


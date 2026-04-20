const firebaseInlineKeys = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY"
];

function getDefaultClientOrigin() {
  if (process.env.CLIENT_ORIGIN) {
    return process.env.CLIENT_ORIGIN;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:5173";
}

function normalizeClientOrigins(value) {
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getServerConfig() {
  const clientOrigin = getDefaultClientOrigin();

  return {
    port: Number(process.env.PORT || 4000),
    clientOrigin,
    clientOrigins: normalizeClientOrigins(clientOrigin)
  };
}

export function validateServerEnv() {
  const missingKeys = [];
  const hasMongoUri = Boolean(process.env.MONGODB_URI);
  const hasServiceAccountPath = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  const hasInlineFirebaseCredentials = firebaseInlineKeys.every(
    (key) => Boolean(process.env[key])
  );

  if (!hasMongoUri) {
    missingKeys.push("MONGODB_URI");
  }

  if (!hasServiceAccountPath && !hasInlineFirebaseCredentials) {
    missingKeys.push(
      "FIREBASE_SERVICE_ACCOUNT_JSON o FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY"
    );
  }

  if (missingKeys.length > 0) {
    throw new Error(
      `Faltan variables de entorno del backend: ${missingKeys.join(", ")}.`
    );
  }
}

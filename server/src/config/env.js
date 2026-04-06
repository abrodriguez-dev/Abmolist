const firebaseInlineKeys = [
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

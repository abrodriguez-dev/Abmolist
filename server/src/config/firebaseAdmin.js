import admin from "firebase-admin";
import { readFileSync } from "node:fs";

function getPrivateKey() {
  const value = process.env.FIREBASE_PRIVATE_KEY;
  return value ? value.replace(/\\n/g, "\n") : undefined;
}

function getServiceAccountFromFile() {
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!filePath) {
    return null;
  }

  const fileContents = readFileSync(filePath, "utf8");
  const credentials = JSON.parse(fileContents);

  return {
    projectId: credentials.project_id,
    clientEmail: credentials.client_email,
    privateKey: credentials.private_key
  };
}

export function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccount = getServiceAccountFromFile();
  const projectId =
    serviceAccount?.projectId || process.env.FIREBASE_PROJECT_ID;
  const clientEmail =
    serviceAccount?.clientEmail || process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = serviceAccount?.privateKey || getPrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Faltan credenciales de Firebase Admin. Usa FIREBASE_SERVICE_ACCOUNT_JSON o completa FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY."
    );
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey
    })
  });
}

export const verifyFirebaseToken = async (token) => {
  initializeFirebaseAdmin();
  return admin.auth().verifyIdToken(token);
};

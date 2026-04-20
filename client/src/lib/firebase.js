import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const requiredFirebaseEnv = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID"
];

const missingFirebaseEnv = requiredFirebaseEnv.filter(
  (key) => !import.meta.env[key]
);

export const isFirebaseConfigured = missingFirebaseEnv.length === 0;
export const missingFirebaseEnvKeys = missingFirebaseEnv;

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const googleProvider = auth ? new GoogleAuthProvider() : null;

const firebaseErrorMessages = {
  "auth/configuration-not-found":
    "Google Login no esta configurado en Firebase. Activa el proveedor Google en Authentication > Sign-in method.",
  "auth/operation-not-allowed":
    "Este metodo de acceso no esta habilitado en Firebase Authentication.",
  "auth/unauthorized-domain":
    "Este dominio no esta autorizado en Firebase. Anade localhost en Authentication > Settings > Authorized domains.",
  "auth/popup-blocked":
    "El navegador bloqueo la ventana emergente de Google. Permite popups e intentalo de nuevo.",
  "auth/popup-closed-by-user":
    "Cerraste la ventana de acceso con Google antes de completar el inicio de sesion."
};

function createMissingConfigError() {
  return new Error(
    `Falta configurar Firebase en el cliente. Revisa estas variables: ${missingFirebaseEnv.join(", ")}.`
  );
}

export function getFirebaseErrorMessage(error) {
  if (!error?.code) {
    return error?.message || "Ha ocurrido un error inesperado con Firebase.";
  }

  return firebaseErrorMessages[error.code] || error.message;
}

export const onAuthChanged = (callback) => {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
};

export const loginWithGoogle = () => {
  if (!auth || !googleProvider) {
    return Promise.reject(createMissingConfigError());
  }

  return signInWithPopup(auth, googleProvider);
};

export const registerWithEmail = (email, password) => {
  if (!auth) {
    return Promise.reject(createMissingConfigError());
  }

  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithEmail = (email, password) => {
  if (!auth) {
    return Promise.reject(createMissingConfigError());
  }

  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  if (!auth) {
    return Promise.reject(createMissingConfigError());
  }

  return signOut(auth);
};

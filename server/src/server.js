import "dotenv/config";
import { createApp } from "./app.js";
import { getServerConfig, validateServerEnv } from "./config/env.js";
import { connectToDatabase } from "./config/mongoose.js";

export const config = getServerConfig();

validateServerEnv();

const app = createApp(config);
let initializationPromise = null;

export function initializeServer() {
  if (!initializationPromise) {
    initializationPromise = connectToDatabase().catch((error) => {
      initializationPromise = null;
      throw error;
    });
  }

  return initializationPromise;
}

export default app;

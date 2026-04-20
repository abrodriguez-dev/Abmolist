import express from "express";
import { getHealth } from "./controllers/healthController.js";
import todoRoutes from "./routes/todoRoutes.js";

export function createApp({ clientOrigins = [] }) {
  const app = express();
  const allowedOrigins = new Set(clientOrigins);

  app.use((request, response, next) => {
    const origin = request.headers.origin;

    if (!origin || allowedOrigins.has(origin)) {
      response.header("Vary", "Origin");

      if (origin) {
        response.header("Access-Control-Allow-Origin", origin);
      }

      response.header(
        "Access-Control-Allow-Methods",
        "GET,POST,PATCH,DELETE,OPTIONS"
      );
      response.header(
        "Access-Control-Allow-Headers",
        "Authorization,Content-Type"
      );
    }

    if (request.method === "OPTIONS") {
      return response.status(204).send();
    }

    return next();
  });
  app.use(express.json());

  app.get("/api/health", getHealth);

  app.use("/api/todos", todoRoutes);

  app.use((error, _request, response, _next) => {
    console.error(error);
    response.status(500).json({
      message: "Ha ocurrido un error interno en el servidor."
    });
  });

  return app;
}

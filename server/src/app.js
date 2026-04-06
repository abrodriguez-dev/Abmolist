import cors from "cors";
import express from "express";
import { getHealth } from "./controllers/healthController.js";
import todoRoutes from "./routes/todoRoutes.js";

export function createApp({ clientOrigin }) {
  const app = express();

  app.use(
    cors({
      origin: clientOrigin
    })
  );
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

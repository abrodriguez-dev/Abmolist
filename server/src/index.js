import "dotenv/config";
import cors from "cors";
import express from "express";
import { connectToDatabase } from "./config/mongoose.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: clientOrigin
  })
);
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/todos", todoRoutes);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({
    message: "Ha ocurrido un error interno en el servidor."
  });
});

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`API lista en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("No fue posible conectar con MongoDB Atlas.", error);
    process.exit(1);
  });

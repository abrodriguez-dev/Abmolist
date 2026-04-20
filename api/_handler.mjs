import app, { initializeServer } from "../server/src/server.js";

export default async function handleApiRequest(request, response) {
  try {
    await initializeServer();
    return app(request, response);
  } catch (error) {
    console.error("No fue posible inicializar la API en Vercel.", error);
    return response.status(500).json({
      message: "No fue posible inicializar el backend."
    });
  }
}

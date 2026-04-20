import app, { config, initializeServer } from "./server.js";

initializeServer()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`API lista en http://localhost:${config.port}`);
    });
  })
  .catch((error) => {
    console.error("No fue posible conectar con MongoDB Atlas.", error);
    process.exit(1);
  });

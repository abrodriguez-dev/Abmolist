import "dotenv/config";
import { createApp } from "./app.js";
import { getServerConfig, validateServerEnv } from "./config/env.js";
import { connectToDatabase } from "./config/mongoose.js";
const config = getServerConfig();
const app = createApp(config);

validateServerEnv();

connectToDatabase()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`API lista en http://localhost:${config.port}`);
    });
  })
  .catch((error) => {
    console.error("No fue posible conectar con MongoDB Atlas.", error);
    process.exit(1);
  });

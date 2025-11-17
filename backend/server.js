// ============================================================
// SERVER — Inicialización del servidor
// ============================================================

import app from "./app.js";
import { config } from "./config/config.js";
import { getConnection } from "./database/database.js";

async function startServer() {
  try {
    // Verificar conexión a la base de datos
    const db = getConnection();
    await db.query("SELECT 1");
    console.log("✅ Conexión a la base de datos exitosa");

    // Levantar servidor
    app.listen(config.port, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("❌ Error iniciando el servidor:", error);
    process.exit(1);
  }
}

startServer();

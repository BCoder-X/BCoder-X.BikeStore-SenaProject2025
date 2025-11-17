// ============================================================
// APP PRINCIPAL — Servidor Express
// ============================================================

import express from "express";
import cors from "cors";
import { config } from "./config/config.js";

// Importar rutas
import productsRoutes from "./routes/products.routes.js";
import usersRoutes from "./routes/users.routes.js";
import ordersRoutes from "./routes/orders.routes.js"; // 👈 FALTABAN ESTAS RUTAS

const app = express();

// Middleware
app.use(cors({ origin: config.cors.origin }));
app.use(express.json());

// Rutas API
app.use("/api/productos", productsRoutes);
app.use("/api/usuarios", usersRoutes);
app.use("/api/orders", ordersRoutes); // 👈 REGISTRO REAL DE RUTAS DE PEDIDOS

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("✅ API Bike Store funcionando correctamente");
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ ok: false, message: "Error interno del servidor" });
});

// Levantar servidor
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

export default app;

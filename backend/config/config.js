// ============================================================
// CONFIGURACIÓN GENERAL DEL BACKEND
// Autor: Bryan David López Campos
// ============================================================

import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,

  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "bikestore",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },
};

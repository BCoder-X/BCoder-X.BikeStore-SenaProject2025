// ============================================================
// DATABASE — MySQL Pool
// ============================================================

import mysql from "mysql2/promise";
import { config } from "../config/config.js";

// Crear el pool de conexiones
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Función para obtener el pool
export function getConnection() {
  return pool;
}

// Función de ejemplo para consultas rápidas
export async function query(sql, params) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

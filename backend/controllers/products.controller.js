import { getConnection } from "../database/database.js";

/**
 * ============================================================
 * Obtener productos por categoría
 * GET /api/productos/:categoria
 * ============================================================
 */
export const getProductsByCategory = async (req, res) => {
  const { categoria } = req.params;

  try {
    const db = await getConnection();
    const [rows] = await db.query(
      "SELECT * FROM productos WHERE LOWER(categoria) = LOWER(?)",
      [categoria]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo productos por categoría:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

/**
 * ============================================================
 * Obtener todos los productos
 * GET /api/productos
 * ============================================================
 */
export const getAllProducts = async (req, res) => {
  try {
    const db = await getConnection();
    const [rows] = await db.query("SELECT * FROM productos");

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo todos los productos:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

/**
 * ============================================================
 * Obtener producto por ID
 * GET /api/productos/id/:id
 * ============================================================
 */
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getConnection();
    const [rows] = await db.query(
      "SELECT * FROM productos WHERE id_producto = ?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ ok: false, message: "Producto no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error obteniendo producto por ID:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
};

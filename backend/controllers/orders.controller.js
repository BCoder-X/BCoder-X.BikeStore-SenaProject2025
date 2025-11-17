// ============================================================
//  CONTROLLER: Orders Controller
//  Gestión de pedidos y sus detalles
//  Autor: Bryan David López Campos
// ============================================================

import { getConnection } from "../database/database.js";

/* ============================================================
   📌 Crear Pedido
   Ruta: POST /api/orders
   ============================================================ */
export const createOrder = async (req, res) => {
  const { id_usuario, metodo_pago, descripcion, productos } = req.body;

  if (!id_usuario || !metodo_pago || !productos || productos.length === 0) {
    return res.status(400).json({
      ok: false,
      message: "Datos incompletos para crear el pedido.",
    });
  }

  const db = await getConnection(); // pool
  const connection = await db.getConnection(); // conexión real para transacciones

  try {
    await connection.beginTransaction();

    let precio_total = 0;

    // =====================================================
    // 🔍 Verificar stock y calcular total
    // =====================================================
    for (const p of productos) {
      const [prod] = await connection.query(
        "SELECT precio, stock FROM productos WHERE id_producto = ?",
        [p.id_producto]
      );

      if (prod.length === 0)
        throw new Error(`Producto ${p.id_producto} no existe.`);

      if (prod[0].stock < p.cantidad)
        throw new Error(`Stock insuficiente para el producto ${p.id_producto}`);

      precio_total += prod[0].precio * p.cantidad;
    }

    // =====================================================
    // 🧾 Crear pedido principal
    // =====================================================
    const [pedidoResult] = await connection.query(
      `INSERT INTO pedido 
        (fecha_pedido, precio_total, descripcion, metodo_pago, id_usuario) 
       VALUES (CURRENT_DATE, ?, ?, ?, ?)`,
      [precio_total, descripcion, metodo_pago, id_usuario]
    );

    const id_pedido = pedidoResult.insertId;

    // =====================================================
    // ➕ Crear detalle por producto y actualizar stock
    // =====================================================
    for (const p of productos) {
      const [prod] = await connection.query(
        "SELECT precio FROM productos WHERE id_producto = ?",
        [p.id_producto]
      );

      await connection.query(
        `INSERT INTO detalle_pedido 
          (id_pedido, id_producto, cantidad, precio_unitario)
         VALUES (?, ?, ?, ?)`,
        [id_pedido, p.id_producto, p.cantidad, prod[0].precio]
      );

      await connection.query(
        "UPDATE productos SET stock = stock - ? WHERE id_producto = ?",
        [p.cantidad, p.id_producto]
      );
    }

    await connection.commit();
    connection.release();

    return res.json({
      ok: true,
      message: "Pedido creado exitosamente.",
      id_pedido,
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("❌ Error creando pedido:", error.message);

    return res.status(500).json({
      ok: false,
      message: "Error al crear el pedido.",
      error: error.message,
    });
  }
};

/* ============================================================
   📌 Obtener todos los pedidos
   Ruta: GET /api/orders
   ============================================================ */
export const getAllOrders = async (req, res) => {
  try {
    const db = await getConnection();
    const [rows] = await db.query(
      "SELECT * FROM pedido ORDER BY id_pedido DESC"
    );

    return res.json({
      ok: true,
      pedidos: rows,
    });
  } catch (error) {
    console.error("❌ Error obteniendo pedidos:", error.message);

    return res.status(500).json({
      ok: false,
      message: "Error obteniendo los pedidos.",
      error: error.message,
    });
  }
};

/* ============================================================
   📌 Obtener pedido por ID
   Ruta: GET /api/orders/:id
   ============================================================ */
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const db = await getConnection();

    // 📌 Obtener datos del pedido
    const [pedido] = await db.query(
      "SELECT * FROM pedido WHERE id_pedido = ?",
      [id]
    );

    if (pedido.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Pedido no encontrado",
      });
    }

    // 📌 Obtener detalles del pedido
    const [detalles] = await db.query(
      `SELECT d.id_detalle, d.id_producto, d.cantidad, d.precio_unitario,
              p.nombre AS nombre_producto, p.imagen
       FROM detalle_pedido d
       INNER JOIN productos p ON p.id_producto = d.id_producto
       WHERE d.id_pedido = ?`,
      [id]
    );

    return res.json({
      ok: true,
      pedido: pedido[0],
      detalles,
    });
  } catch (error) {
    console.error("❌ Error en getOrderById:", error.message);

    return res.status(500).json({
      ok: false,
      message: "Error obteniendo el pedido.",
      error: error.message,
    });
  }
};

// ============================================================
//  ROUTES: Orders Routes
//  Gestión de pedidos
//  Autor: Bryan David López Campos
// ============================================================

import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById
} from "../controllers/orders.controller.js";

const router = Router();

/* ============================================================
   🧾 Crear un nuevo pedido
   POST /api/orders
   ============================================================ */
router.post("/", createOrder);

/* ============================================================
   📌 Obtener todos los pedidos
   GET /api/orders
   ============================================================ */
router.get("/", getAllOrders);

/* ============================================================
   🔍 Obtener un pedido por su ID (incluye detalles)
   GET /api/orders/:id
   ============================================================ */
router.get("/:id", getOrderById);

export default router;

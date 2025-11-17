import { Router } from "express";
import {
  getAllProducts,
  getProductsByCategory,
  getProductById,
} from "../controllers/products.controller.js";

const router = Router();

// Obtener todos
router.get("/", getAllProducts);

// Obtener por ID (ruta más específica)
router.get("/id/:id", getProductById);

// Obtener por categoría (ruta más genérica)
router.get("/:categoria", getProductsByCategory);

export default router;

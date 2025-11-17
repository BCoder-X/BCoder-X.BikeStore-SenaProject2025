import { Router } from "express";
import { 
  getAllUsers, 
  loginUser, 
  createUser, 
  updateUser,
  getUserByEmail                // ⬅️ NUEVO
} from "../controllers/users.controller.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/correo/:correo", getUserByEmail);   // ⬅️ NUEVO
router.post("/login", loginUser);
router.post("/", createUser);
router.put("/:id", updateUser);

export default router;

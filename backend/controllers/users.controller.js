import { getConnection } from "../database/database.js";
import bcrypt from "bcrypt";

// ============================================================
// Obtener todos los usuarios
// GET /api/usuarios
// ============================================================
export const getAllUsers = async (req, res) => {
  try {
    const db = await getConnection();
    const [rows] = await db.query("SELECT * FROM usuario");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ============================================================
// Login seguro
// POST /api/usuarios/login
// ============================================================
export const loginUser = async (req, res) => {
  const { correo, clave } = req.body;

  if (!correo || !clave) {
    return res
      .status(400)
      .json({ message: "Correo y contraseña son requeridos" });
  }

  try {
    const db = await getConnection();
    const [rows] = await db.query("SELECT * FROM usuario WHERE correo = ?", [
      correo,
    ]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(clave, user.clave);
    if (!valid) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // No enviar la contraseña al frontend
    const { clave: _, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ============================================================
// Crear usuario (registro)
// POST /api/usuarios
// ============================================================
export const createUser = async (req, res) => {
  const { nombres, apellidos, correo, clave, telefono, direccion, rol } =
    req.body;

  if (!nombres || !correo || !clave) {
    return res
      .status(400)
      .json({ message: "Nombre, correo y contraseña son requeridos" });
  }

  try {
    const db = await getConnection();
    const [existing] = await db.query(
      "SELECT * FROM usuario WHERE correo = ?",
      [correo]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Correo ya registrado" });
    }

    const hashedPassword = await bcrypt.hash(clave, 10);
    const [result] = await db.query(
      "INSERT INTO usuario (nombres, apellidos, correo, clave, rol, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        nombres,
        apellidos || "",
        correo,
        hashedPassword,
        rol || "Cliente",
        direccion || "",
        telefono || "",
      ]
    );

    res.json({
      id_usuario: result.insertId,
      nombres,
      apellidos,
      correo,
      rol: rol || "Cliente",
      direccion: direccion || "",
      telefono: telefono || "",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ============================================================
// Actualizar usuario
// PUT /api/usuarios/:id
// ============================================================
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, correo, telefono, direccion } = req.body;

  if (!nombres || !correo) {
    return res.status(400).json({ message: "Nombre y correo son requeridos" });
  }

  try {
    const db = await getConnection();
    await db.query(
      "UPDATE usuario SET nombres=?, apellidos=?, correo=?, telefono=?, direccion=? WHERE id_usuario=?",
      [nombres, apellidos || "", correo, telefono || "", direccion || "", id]
    );

    res.json({
      id_usuario: id,
      nombres,
      apellidos,
      correo,
      telefono,
      direccion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
// ============================================================
// Obtener usuario por correo
// GET /api/usuarios/correo/:correo
// ============================================================
export const getUserByEmail = async (req, res) => {
  const { correo } = req.params;

  try {
    const db = await getConnection();
    const [rows] = await db.query(
      "SELECT id_usuario, nombres, apellidos, correo, telefono, direccion, rol FROM usuario WHERE correo = ?",
      [correo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(rows[0]); // enviamos solo un usuario
  } catch (error) {
    console.error("Error en getUserByEmail:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

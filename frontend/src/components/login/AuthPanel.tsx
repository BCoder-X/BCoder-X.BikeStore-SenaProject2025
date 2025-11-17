// ============================================================
// COMPONENTE: AuthPanel
// Autor: Bryan David López Campos
// ============================================================

import { useState, useEffect } from "react";
import "./auth.css";
import { useAuth } from "../../Context/AuthContext";
import type { User } from "../../Context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

interface AuthPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type FormDataUser = {
  nombres: string;
  apellidos: string;
  correo: string;
  clave: string;
  telefono: string;
};

export default function AuthPanel({ isOpen, onClose }: AuthPanelProps) {
  const { usuarioLogin, setUsuarioLogin, logout } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<FormDataUser>({
    nombres: "",
    apellidos: "",
    correo: "",
    clave: "",
    telefono: "",
  });

  const [currentUser, setCurrentUser] = useState<User | null>(usuarioLogin);

  useEffect(() => {
    setCurrentUser(usuarioLogin);
  }, [usuarioLogin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // ============================================================
  // LOGIN / REGISTRO
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (mode === "login") {
        const res = await fetch("http://localhost:3000/api/usuarios/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            correo: formData.correo,
            clave: formData.clave,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.message || "Correo o contraseña incorrectos.");
          setLoading(false);
          return;
        }

        const user: User = {
          id: data.id_usuario,
          nombre: data.nombres,
          correo: data.correo,
          rol: data.rol,
        };

        setUsuarioLogin(user);
        setCurrentUser(user);
        setSuccessMsg("Sesión iniciada correctamente");
      }

      if (mode === "register") {
        const res = await fetch("http://localhost:3000/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            rol: "Cliente",
          }),
        });

        if (!res.ok) {
          setErrorMsg("No se pudo registrar el usuario.");
        } else {
          setSuccessMsg("Usuario registrado correctamente");
          setMode("login");
        }
      }
    } catch {
      setErrorMsg("Error de conexión. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  //  GUARDAR PERFIL EDITADO
  // ============================================================
  const handleSaveProfile = async () => {
    if (!currentUser) return;

    const payload = {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      correo: formData.correo,
      telefono: formData.telefono,
    };

    try {
      const res = await fetch(
        `http://localhost:3000/api/usuarios/${currentUser.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        setErrorMsg("No se pudo actualizar el perfil.");
        return;
      }

      // 🔥 MUY IMPORTANTE:
      // Mantener EXACTAMENTE la estructura del User del AuthContext
      const updatedUser: User = {
        id: currentUser.id,
        nombre: formData.nombres, 
        correo: formData.correo,
        rol: currentUser.rol,
      };

      setUsuarioLogin(updatedUser);
      setCurrentUser(updatedUser);
      setEditMode(false);
      setSuccessMsg("Perfil actualizado correctamente");

    } catch {
      setErrorMsg("Error en el servidor.");
    }
  };

  // ============================================================
  // PERFIL DE USUARIO
  // ============================================================
  if (currentUser) {
    return (
      <>
        <aside className={`auth-panel ${isOpen ? "open" : ""}`}>
          <div className="auth-header">
            <h2>Mi Perfil</h2>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>

          <div className="auth-body">
            {successMsg && <p className="auth-success">{successMsg}</p>}
            {errorMsg && <p className="auth-error">{errorMsg}</p>}

            {!editMode ? (
              <div className="profile-info">
                <p><strong>Nombre:</strong> {currentUser.nombre}</p>
                <p><strong>Correo:</strong> {currentUser.correo}</p>
                <p><strong>Rol:</strong> {currentUser.rol}</p>

                <div className="profile-actions">
                  <button
                    className="auth-btn edit-btn"
                    onClick={() => {
                      setEditMode(true);
                      setFormData({
                        nombres: currentUser.nombre,
                        apellidos: "",
                        correo: currentUser.correo,
                        clave: "",
                        telefono: "",
                      });
                    }}
                  >
                    Editar perfil
                  </button>

                  <button
                    className="auth-btn logout-btn"
                    onClick={() => {
                      logout();
                      setCurrentUser(null);
                      setEditMode(false);
                      setSuccessMsg("");
                      setErrorMsg("");
                      setMode("login");
                      setFormData({
                        nombres: "",
                        apellidos: "",
                        correo: "",
                        clave: "",
                        telefono: "",
                      });
                    }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <form className="auth-form">
                <label>Nombre</label>
                <input id="nombres" value={formData.nombres} onChange={handleChange} />

                <label>Correo</label>
                <input id="correo" value={formData.correo} onChange={handleChange} />

                <div className="profile-actions">
                  <button
                    type="button"
                    className="auth-btn"
                    onClick={handleSaveProfile}
                  >
                    Guardar
                  </button>

                  <button
                    type="button"
                    className="auth-btn cancel-btn"
                    onClick={() => setEditMode(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </aside>

        {isOpen && <div className="overlay" onClick={onClose} />}
      </>
    );
  }

  // ============================================================
  // LOGIN / REGISTER FORM
  // ============================================================
  return (
    <>
      <aside className={`auth-panel ${isOpen ? "open" : ""}`}>
        <div className="auth-header">
          <h2>{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="auth-body">
          {errorMsg && <p className="auth-error">{errorMsg}</p>}
          {successMsg && <p className="auth-success">{successMsg}</p>}

          {loading ? (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p>Verificando...</p>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "register" && (
                <>
                  <label>Nombre</label>
                  <input id="nombres" value={formData.nombres} onChange={handleChange} required />

                  <label>Apellidos</label>
                  <input id="apellidos" value={formData.apellidos} onChange={handleChange} />

                  <label>Teléfono</label>
                  <input id="telefono" value={formData.telefono} onChange={handleChange} />
                </>
              )}

              <label>Correo electrónico</label>
              <input id="correo" type="email" value={formData.correo} onChange={handleChange} required />

              <label>Contraseña</label>
              <div className="auth-input-wrapper">
                <input
                  id="clave"
                  type={showPassword ? "text" : "password"}
                  value={formData.clave}
                  onChange={handleChange}
                  required
                />
                <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              <button type="submit" className="auth-btn">
                {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>

              <p className="auth-switch">
                {mode === "login" ? (
                  <>
                    ¿No tienes cuenta?
                    <button type="button" className="link-btn" onClick={() => setMode("register")}>
                      Crear cuenta
                    </button>
                  </>
                ) : (
                  <>
                    ¿Ya tienes cuenta?
                    <button type="button" className="link-btn" onClick={() => setMode("login")}>
                      Iniciar sesión
                    </button>
                  </>
                )}
              </p>
            </form>
          )}
        </div>
      </aside>

      {isOpen && <div className="overlay active" onClick={onClose}></div>}
    </>
  );
}

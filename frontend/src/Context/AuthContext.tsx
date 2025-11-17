import { createContext, useContext, useState, ReactNode, useEffect } from "react";

// ============================================================
//  INTERFAZ DEL USUARIO USADO EN TODA LA APLICACIÓN
// ============================================================
export interface User {
  id: number;
  nombre: string;
  correo: string;
  rol: "Administrador" | "Operario" | "Cliente";
}

// ============================================================
//  INTERFAZ DEL CONTEXTO DE AUTENTICACIÓN
// ============================================================
interface AuthContextType {
  usuarioLogin: User | null;
  setUsuarioLogin: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

// ============================================================
//  CREACIÓN DEL CONTEXTO
// ============================================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================
//  PROVIDER
// ============================================================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  
  // Leer usuario desde localStorage al iniciar
  const [usuarioLogin, setUsuarioLogin] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem("usuarioLogin");
      if (!saved) return null;

      const parsed = JSON.parse(saved);

      // Validar que realmente sea un usuario válido
      if (parsed && typeof parsed.id === "number") {
        return parsed as User;
      }

      return null;
    } catch {
      return null;
    }
  });

  // Guardar usuario en localStorage cuando cambia
  useEffect(() => {
    if (usuarioLogin) {
      localStorage.setItem("usuarioLogin", JSON.stringify(usuarioLogin));
    } else {
      localStorage.removeItem("usuarioLogin");
    }
  }, [usuarioLogin]);

  const logout = () => {
    localStorage.removeItem("usuarioLogin");
    setUsuarioLogin(null);
  };

  return (
    <AuthContext.Provider value={{ usuarioLogin, setUsuarioLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
//  CUSTOM HOOK PARA ACCEDER AL CONTEXTO
// ============================================================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

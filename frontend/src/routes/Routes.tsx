/**
 * ============================================================
 * ROUTES: Definición de rutas de la aplicación 
 * ============================================================
 * Autor: Bryan David López Campos
 */

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Catalogo from "../pages/Catalogo";


// Props para carrito
interface RoutesProps {
  onAddToCart: (item: any) => void;
}

// Categorías del catálogo
const categorias = [
  { path: "montaña", categoria: "montaña" },
  { path: "electrica", categoria: "electrica" },
  { path: "ruta", categoria: "ruta" },
  { path: "urbana", categoria: "urbana" },
  { path: "hibrida", categoria: "hibrida" },
  { path: "infantil", categoria: "infantil" },
  { path: "componente", categoria: "componente" },
  { path: "accesorio", categoria: "accesorio" },
];

const AppRoutes: React.FC<RoutesProps> = ({ onAddToCart }) => {
  return (
    <Routes>

      {/*  catálogo general o tu Hero */}
      <Route
        path="/"
        element={<Catalogo categoria="montaña" onAddToCart={onAddToCart} />}
      />

      {/*  Catálogos dinámicos */}
      {categorias.map(({ path, categoria }) => (
        <Route
          key={path}
          path={`/${path}`}
          element={<Catalogo onAddToCart={onAddToCart} categoria={categoria} />}
        />
      ))}


      {/*  Redirección si no existe la ruta */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

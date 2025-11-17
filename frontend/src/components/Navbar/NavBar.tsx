/**
 * ============================================================
 * COMPONENTE: NavBar 
 * ============================================================
 * Autor: Bryan David López Campos
 * ============================================================
 */

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "./NavBar.css";

const links = [
  { to: "/montaña", text: "Montaña" },
  { to: "/electrica", text: "Eléctrica" },
  { to: "/ruta", text: "Ruta" },
  { to: "/urbana", text: "Urbanas" },
  { to: "/hibrida", text: "Híbridas" },
  { to: "/infantil", text: "Infantiles" },
  { to: "/componente", text: "Componentes" },
  { to: "/accesorio", text: "Accesorios" },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav id="component-bottomNav">
      {/* Botón hamburguesa */}
      <button
        className="component-bottomNav-toggle"
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>

      {/* Lista de enlaces */}
      <ul
        className={`component-bottomNav-list ${
          menuOpen ? "show" : ""
        }`}
      >
        {links.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              {item.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

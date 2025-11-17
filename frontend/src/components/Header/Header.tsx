/**
 * ============================================================
 * COMPONENTE: Header — Bike Store
 * ============================================================
 * Autor: Bryan David López Campos
 * Descripción:
 *   Cabecera principal del e-commerce Bike Store.
 * ============================================================
 */

import React, { useState, type FormEvent } from "react";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import "./Header.css";
import "../../App";

interface HeaderProps {
  onCartClick: () => void;
  onLoginClick: () => void;
  onLogout?: () => void;
  cartCount: number;
  usuarioLogin: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onCartClick,
  onLoginClick,
  onLogout,
  cartCount,
  usuarioLogin,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchValue)}`;
    }
  };

  return (
    <header className="component-header" role="banner">
      <div className="component-top-header">
        
        {/* LOGO */}
        <div className="component-logo">
          <a href="/" title="Inicio">
            <span>Bike</span>Store
          </a>
        </div>

        {/* ACCIONES */}
        <div className="component-header-actions">
          {/* LOGIN / PERFIL */}
          <button
            className="component-login-btn"
            aria-label={usuarioLogin ? "Ver perfil" : "Iniciar sesión"}
            title={usuarioLogin ? "Perfil" : "Iniciar sesión"}
            onClick={onLoginClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
            <span>{usuarioLogin ? "Perfil" : "Ingresar"}</span>
          </button>

          {/* CARRITO */}
          <button
            className="component-cart-btn"
            aria-label={`Carrito con ${cartCount} artículo${
              cartCount === 1 ? "" : "s"
            }`}
            onClick={onCartClick}
          >
            <FaShoppingCart />
            <span
              className={`component-cart-count ${
                cartCount > 0 ? "bump" : ""
              }`}
              aria-live="polite"
            >
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

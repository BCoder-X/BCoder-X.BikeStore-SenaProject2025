/**
 * ============================================================
 *  COMPONENTE: HeaderTop — Bike Store
 * ============================================================
 * Autor: David López Campos
 * Descripción:
 *   Barra superior con contacto, redes sociales y contenido dinámico.
 * ============================================================
 */

import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import "./headerTop.css";

interface TopBarProps {
  children?: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({ children }) => {
  return (
    <header
      id="bikeStore-topBar"
      role="banner"
      aria-label="Barra superior de contacto y redes sociales"
    >
      <div className="bikeStore-topBar-container">

        {/* CONTACTO */}
        <div className="bikeStore-topBar-left" aria-label="Información de contacto">
          <a href="tel:+573000000000" className="topBar-item" title="Llamar a Bike Store">
            <FaPhone aria-hidden="true" />
            +57 300 000 0000
          </a>

          <a
            href="mailto:contacto@bikestore.com"
            className="topBar-item"
            title="Enviar correo a Bike Store"
          >
            <FaEnvelope aria-hidden="true" />
            contacto@bikestore.com
          </a>
        </div>

        {/* CHILDREN DINÁMICOS */}
        {children && (
          <div className="bikeStore-topBar-children">{children}</div>
        )}

        {/* REDES SOCIALES */}
        <nav
          className="bikeStore-topBar-right"
          aria-label="Enlaces a redes sociales"
        >
          {[
            { icon: <FaFacebookF />, label: "Facebook" },
            { icon: <FaInstagram />, label: "Instagram" },
            { icon: <FaWhatsapp />, label: "WhatsApp" },
          ].map((r, i) => (
            <a
              key={i}
              href="#"
              aria-label={r.label}
              title={`Abrir ${r.label}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {r.icon}
            </a>
          ))}
        </nav>

      </div>
    </header>
  );
};

export default TopBar;

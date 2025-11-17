/**
 * ============================================================
 * COMPONENTE: Footer 
 * ============================================================
 */

import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";
import "./footer.css";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer
      id="bikeStore-footer"
      role="contentinfo"
      aria-label="Pie de página de Bike Store"
    >
      <div className="bikeStore-footer-container">

        {/* LOGO Y DESCRIPCIÓN */}
        <section className="bikeStore-footer-section">
          <h2 className="bikeStore-footer-logo">
            <span>Bike</span>Store
          </h2>
          <p>
            Tu tienda online especializada en bicicletas, repuestos y accesorios.
            Calidad, tecnología y pasión por el ciclismo en Colombia.
          </p>
        </section>

        {/* CONTACTO */}
        <section className="bikeStore-footer-section">
          <h3>Contacto</h3>

          <ul className="bikeStore-footer-contact">
            <li>
              <FaMapMarkerAlt aria-hidden="true" /> Bogotá, Colombia
            </li>

            <li>
              <FaEnvelope aria-hidden="true" />
              <a href="mailto:contacto@bikestore.com.co">
                contacto@bikestore.com.co
              </a>
            </li>

            <li>
              <FaPhoneAlt aria-hidden="true" />
              <a href="tel:+573001234567">+57 300 123 4567</a>
            </li>
          </ul>

          {/* REDES */}
          <div className="bikeStore-footer-social">
            <a
              href="https://www.facebook.com/"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>

            <a
              href="https://web.whatsapp.com/"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
            </a>
          </div>
        </section>
      </div>

      {/* COPYRIGHT */}
      <div className="bikeStore-footer-bottom">
        <p>
          &copy; {year} <strong>Bike Store Colombia</strong>. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

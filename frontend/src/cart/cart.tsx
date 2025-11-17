// ============================================================
//  COMPONENTE: CartPanel 
// ============================================================

import React, { useState } from "react";
import "./cart.css";
import CheckoutModal from "./CheckoutModal";
import type { User } from "../Context/AuthContext";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  quantity: number;
  discount?: number;
}

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  usuarioLogin: User | null;
  setUsuarioLogin?: React.Dispatch<React.SetStateAction<User | null>>;
  onLoginRequest: (mode?: "login" | "register") => void;
}

export default function CartPanel({
  isOpen,
  onClose,
  cartItems,
  setCartItems,
  usuarioLogin,
  onLoginRequest,
}: CartPanelProps) {

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // 🔄 Cantidades
  const changeQuantity = (id: number, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(20, item.quantity + delta)) }
          : item
      )
    );
  };

  // 🗑️ Eliminar
  const removeItem = (id: number) =>
    setCartItems(items => items.filter(item => item.id !== id));

  // 💰 Totales
  const subtotal = cartItems.reduce(
    (acc, i) => acc + i.price * i.quantity,
    0
  );

  const discount = cartItems.reduce(
    (acc, item) =>
      item.discount
        ? acc + (item.price * item.quantity * item.discount) / 100
        : acc,
    0
  );

  const shipping = subtotal > 0 ? 15000 : 0;
  const total = subtotal - discount + shipping;

  // 🧾 Checkout con login 
  const checkoutHandler = () => {
    if (!usuarioLogin) {
      // Cerrar carrito
      onClose();

      // Abrir AutPanel sin solaparse
      setTimeout(() => {
        onLoginRequest("login");
      }, 300);

      return;
    }

    // Usuario autenticado
    onClose();
    setIsCheckoutOpen(true);
  };

  return (
    <>
      <aside className={`cart-panel ${isOpen ? "open" : ""}`}>

        {/* HEADER */}
        <div className="cart-header">
          <h2>CARRITO</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* CONTENIDO */}
        <div className="cart-scroll-content">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <p>Tu carrito está vacío.</p>
              <button className="checkout-btn" onClick={onClose}>
                CONTINUAR COMPRANDO
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>

                  {item.oldPrice && (
                    <p className="old-price">${item.oldPrice.toLocaleString()}</p>
                  )}

                  <p className="price">${item.price.toLocaleString()}</p>

                  <div className="quantity-control">
                    <button onClick={() => changeQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => changeQuantity(item.id, 1)}>+</button>
                  </div>
                </div>

                <button className="remove-item" onClick={() => removeItem(item.id)}>
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="cart-footer">
          <div className="summary-line">
            <span>Subtotal:</span>
            <strong>${subtotal.toLocaleString()}</strong>
          </div>

          {discount > 0 && (
            <div className="summary-line discount">
              <span>Descuento:</span>
              <strong>- ${discount.toLocaleString()}</strong>
            </div>
          )}

          <div className="summary-line">
            <span>Envío:</span>
            <strong>${shipping.toLocaleString()}</strong>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total:</span>
            <strong>${total.toLocaleString()}</strong>
          </div>

          <button
            className="checkout-btn"
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            {usuarioLogin ? "Continuar compra" : "REALIZAR PEDIDO"}
          </button>
        </div>
      </aside>

      {/* OVERLAY */}
      {isOpen && <div className="overlay active" onClick={onClose}></div>}

      {/* MODAL CHECKOUT */}
      {isCheckoutOpen && usuarioLogin && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
      )}
    </>
  );
}

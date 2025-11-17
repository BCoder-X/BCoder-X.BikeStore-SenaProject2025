// ============================================================
//  COMPONENTE: CheckoutModal 
// ============================================================

import React, { useState } from "react";
import {
  FaCreditCard,
  FaPaypal,
  FaMobileAlt,
  FaUniversity,
} from "react-icons/fa";
import Swal from "sweetalert2";
import "./CheckoutModal.css";
import { useAuth } from "../Context/AuthContext";

// ============================================================
// Tipos e interfaces
// ============================================================

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  discount?: number;
  image: string;
}

type PaymentMethod = "nequi" | "visa" | "mastercard" | "paypal" | "pse";
type PaymentStatus = "none" | "processing" | "success";

interface CheckoutModalProps {
  cartItems: CartItem[];
  onClose: () => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function CheckoutModal({
  cartItems,
  onClose,
  setCartItems,
}: CheckoutModalProps) {
  
  const { usuarioLogin } = useAuth();

  // ============================================================
  // ❗ FIX: Solo mostrar "carrito vacío" si el paso es 1
  // ============================================================
  const [step, setStep] = useState(1);

  if (step === 1 && cartItems.length === 0) {
    return (
      <div className="checkout-modal">
        <div className="checkout-content">
          <button className="close-btn" onClick={onClose}>✕</button>
          <h3>Tu carrito está vacío</h3>
        </div>
        <div className="checkout-overlay" onClick={onClose}></div>
      </div>
    );
  }

  // ============================================================
  // Estados del Wizard
  // ============================================================

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("nequi");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("none");

  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");

  const [address, setAddress] = useState({
    calle: "",
    carrera: "",
    numero: "",
    vivienda: "",
  });

  const [paymentData, setPaymentData] = useState({
    nequi: "",
    cardNumber: "",
    cardName: "",
    cardExp: "",
    cardCvv: "",
    pseBank: "",
  });

  const [finalOrder, setFinalOrder] = useState<null | {
    items: CartItem[];
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
    paymentMethod: string;
    address: string;
  }>(null);

  const departamentos: Record<string, string[]> = {
    Antioquia: ["Medellín", "Envigado", "Bello"],
    Cundinamarca: ["Bogotá", "Soacha", "Chía"],
    "Valle del Cauca": ["Cali", "Palmira", "Jamundí"],
    Atlántico: ["Barranquilla", "Soledad", "Malambo"],
  };

  const isAddressComplete =
    department.trim() !== "" &&
    city.trim() !== "" &&
    Object.values(address).every((v) => v.trim() !== "");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
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
  const total = Math.round(subtotal - discount + shipping);

  const handleNextStep = () => setStep((s) => s + 1);
  const handlePrevStep = () => setStep((s) => Math.max(1, s - 1));

  // ============================================================
  // Validación del pago
  // ============================================================

  const validatePaymentData = async (): Promise<boolean> => {
    const error = (msg: string) =>
      Swal.fire({
        icon: "error",
        title: "Datos inválidos",
        text: msg,
        confirmButtonColor: "#111",
      });

    if (paymentMethod === "nequi" && !/^\d{10}$/.test(paymentData.nequi))
      return error("El número de Nequi debe tener 10 dígitos.").then(() => false);

    if (paymentMethod === "visa" || paymentMethod === "mastercard") {
      if (!/^\d{16}$/.test(paymentData.cardNumber))
        return error("La tarjeta debe tener 16 dígitos.").then(() => false);

      if (paymentData.cardName.trim().length < 5)
        return error("Nombre del titular inválido.").then(() => false);

      if (!/^\d{2}\/\d{2}$/.test(paymentData.cardExp))
        return error("Fecha inválida. Usa MM/AA.").then(() => false);

      if (!/^\d{3,4}$/.test(paymentData.cardCvv))
        return error("El CVV debe tener 3–4 dígitos.").then(() => false);
    }

    if (paymentMethod === "pse" && !paymentData.pseBank.trim())
      return error("Debes seleccionar un banco.").then(() => false);

    return true;
  };

  // ============================================================
  // Procesar pago
  // ============================================================

  const handlePayment = async () => {

    // ✔ FIX DE USUARIO NO IDENTIFICADO
    if (!usuarioLogin || !usuarioLogin.id) {
      return Swal.fire({
        icon: "error",
        title: "Usuario no identificado",
        text: "Debes iniciar sesión para finalizar el pedido.",
        confirmButtonColor: "#111",
      });
    }

    if (!isAddressComplete) {
      return Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Completa la dirección antes de continuar.",
      });
    }

    const orderPayload = {
      id_usuario: usuarioLogin.id, // ✔ FIX REAL
      metodo_pago: paymentMethod,
      descripcion: "Compra desde Checkout",
      productos: cartItems.map((item) => ({
        id_producto: item.id,
        cantidad: item.quantity,
      })),
    };

    try {
      const response = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setFinalOrder({
        items: [...cartItems],
        subtotal,
        discount,
        shipping,
        total,
        paymentMethod: paymentMethod.toUpperCase(),
        address: `${address.calle} #${address.carrera}-${address.numero}, ${address.vivienda}, ${city}, ${department}`,
      });

      setPaymentStatus("processing");

      Swal.fire({
        title: "Procesando pago...",
        html: "Esto puede tardar unos segundos.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      setTimeout(() => {
        Swal.close();
        setPaymentStatus("success");

        // 👇 Carrito se vacía PERO YA NO ROMPE EL PASO 4
        setCartItems([]);
        handleNextStep();
      }, 2000);

    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error en el pedido",
        text: error.message,
      });
    }
  };

  // ============================================================
  // UI DEL CHECKOUT
  // ============================================================

  return (
    <div className="checkout-modal">
      <div className="checkout-content">
        <button className="close-btn" onClick={onClose}>✕</button>

        {/* ===================== PASO 1 ===================== */}
        {step === 1 && (
          <div>
            <h3>🏠 Dirección de envío</h3>

            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setCity("");
              }}
            >
              <option value="">Selecciona un departamento</option>
              {Object.keys(departamentos).map((dep) => (
                <option key={dep}>{dep}</option>
              ))}
            </select>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!department}
            >
              <option value="">Selecciona una ciudad</option>
              {department &&
                departamentos[department].map((c) => (
                  <option key={c}>{c}</option>
                ))}
            </select>

            {(["calle", "carrera", "numero", "vivienda"] as const).map(
              (campo) => (
                <input
                  key={campo}
                  type="text"
                  placeholder={campo}
                  value={address[campo]}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, [campo]: e.target.value }))
                  }
                />
              )
            )}

            <button
              className="checkout-btn"
              disabled={!isAddressComplete}
              onClick={handleNextStep}
            >
              Continuar
            </button>
          </div>
        )}

        {/* ===================== PASO 2 ===================== */}
        {step === 2 && (
          <div>
            <h3>💳 Método de pago</h3>

            <div className="payment-methods">
              {[
                { id: "nequi", label: "Nequi", icon: <FaMobileAlt /> },
                { id: "visa", label: "Visa", icon: <FaCreditCard /> },
                { id: "mastercard", label: "MasterCard", icon: <FaCreditCard /> },
                { id: "paypal", label: "PayPal", icon: <FaPaypal /> },
                { id: "pse", label: "PSE", icon: <FaUniversity /> },
              ].map((method) => (
                <div
                  key={method.id}
                  className={`payment-option ${
                    paymentMethod === method.id ? "active" : ""
                  }`}
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                >
                  {method.icon} {method.label}
                </div>
              ))}
            </div>

            <div className="payment-fields">
              {paymentMethod === "nequi" && (
                <input
                  type="text"
                  placeholder="Número Nequi (10 dígitos)"
                  value={paymentData.nequi}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, nequi: e.target.value })
                  }
                />
              )}

              {(paymentMethod === "visa" ||
                paymentMethod === "mastercard") && (
                <>
                  <input
                    type="text"
                    placeholder="Número de tarjeta"
                    value={paymentData.cardNumber}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        cardNumber: e.target.value,
                      })
                    }
                  />

                  <input
                    type="text"
                    placeholder="Nombre del titular"
                    value={paymentData.cardName}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        cardName: e.target.value,
                      })
                    }
                  />

                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={paymentData.cardExp}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          cardExp: e.target.value,
                        })
                      }
                    />

                    <input
                      type="password"
                      placeholder="CVV"
                      value={paymentData.cardCvv}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          cardCvv: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              )}

              {paymentMethod === "pse" && (
                <input
                  type="text"
                  placeholder="Banco (Ej: Bancolombia)"
                  value={paymentData.pseBank}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, pseBank: e.target.value })
                  }
                />
              )}
            </div>

            <div className="wizard-buttons">
              <button onClick={handlePrevStep}>Atrás</button>
              <button
                onClick={async () => {
                  if (await validatePaymentData()) handleNextStep();
                }}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* ===================== PASO 3 ===================== */}
        {step === 3 && (
          <div>
            <h3>🧾 Resumen</h3>

            <div className="invoice">
              {cartItems.map((item) => (
                <div key={item.id} className="invoice-item">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}

              <hr />

              <div className="invoice-item">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="invoice-item">
                  <span>Descuento:</span>
                  <span>- ${discount.toLocaleString()}</span>
                </div>
              )}

              <div className="invoice-item">
                <span>Envío:</span>
                <span>${shipping.toLocaleString()}</span>
              </div>

              <div className="invoice-item total">
                <span>Total:</span>
                <span>${total.toLocaleString()}</span>
              </div>

              <div className="invoice-item">
                <span>Método de pago:</span>
                <span>{paymentMethod.toUpperCase()}</span>
              </div>
            </div>

            <div className="wizard-buttons">
              <button onClick={handlePrevStep}>Atrás</button>
              <button onClick={handlePayment}>
                {paymentStatus === "processing" ? "Procesando..." : "Finalizar pedido"}
              </button>
            </div>
          </div>
        )}

        {/* ===================== PASO 4 ===================== */}
        {step === 4 && paymentStatus === "success" && finalOrder && (
          <div className="payment-success">
            <h3>✅ Pedido realizado</h3>
            <p>¡Tu compra ha sido completada exitosamente! 🛍️</p>

            <div className="invoice">
              {finalOrder.items.map((item) => (
                <div key={item.id} className="invoice-item">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span>
                    ${(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}

              <hr />

              <div className="invoice-item total">
                <span>Total pagado:</span>
                <span>${finalOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={onClose}>Cerrar</button>
          </div>
        )}
      </div>

      <div className="checkout-overlay" onClick={onClose}></div>
    </div>
  );
}

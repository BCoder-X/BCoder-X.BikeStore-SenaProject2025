/**
 * ============================================================
 * COMPONENTE PRINCIPAL: App.tsx
 * Autor: Bryan David López Campos
 * ============================================================
 */

import "./assets/styles/styles.css";
import { CartProvider } from "../src/Context/CartContext";
import { AuthProvider } from "../src/Context/AuthContext";
import Layout from "../src/Layout/Layout";
import Toast from "../src/components/Toast/Toast";

export default function App() {
  return (
      <AuthProvider>
        <CartProvider>
          <Layout />
          <Toast />
        </CartProvider>
      </AuthProvider>
  );
}

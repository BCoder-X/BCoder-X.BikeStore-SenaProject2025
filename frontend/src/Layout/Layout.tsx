/**
 * ============================================================
 * COMPONENTE: Layout
 * ============================================================
 */

import { useState } from "react";
import { useCart } from "../Hooks/useCart";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../Context/AuthContext";

import HeaderTop from "../components/Header/HeaderTop";
import Header from "../components/Header/Header";
import NavBar from "../components/Navbar/NavBar";
import CartPanel from "../cart/cart";
import AuthPanel from "../components/login/AuthPanel";
import Footer from "../components/Footer/footer";
import AppRoutes from "../routes/Routes";

export default function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { cartItems, setCartItems, addToCart, count } = useCart();
  const { toast, showToast } = useToast();
  const { usuarioLogin, setUsuarioLogin } = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(false);


  const handleAddToCart = (item: any) => {
    addToCart(item);
    showToast(`🛒 ${item.name} agregado al carrito`);
  };

  return (
    <>
      <HeaderTop />

      <Header
        cartCount={count}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setIsLoginOpen(true)}
        usuarioLogin={!!usuarioLogin}
        onLogout={() => setUsuarioLogin(null)}
      />

      <NavBar />

      <main>
        <AppRoutes onAddToCart={handleAddToCart} />
      </main>

      <CartPanel
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
        usuarioLogin={usuarioLogin}
        setUsuarioLogin={setUsuarioLogin}
        onLoginRequest={() => setIsLoginOpen(true)}
      />

      <AuthPanel
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      <Footer />

      {toast && (
        <div className="toast-notification" onClick={() => showToast("")}>
          {toast}
        </div>
      )}
    </>
  );
}

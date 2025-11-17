import { useState, useEffect } from "react";
import type { CartItem } from "../cart/cart";

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCartItems(prev => {
      const existing = prev.find(p => p.id === item.id);
      return existing
        ? prev.map(p =>
            p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
          )
        : [...prev, { ...item, quantity: 1 }];
    });
  };

  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return { cartItems, setCartItems, addToCart, count };
}

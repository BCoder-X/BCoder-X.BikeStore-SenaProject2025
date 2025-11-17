import React from "react";
import { useProducts } from "../Hooks/useProducts";
import Productos from "../components/Productos/PanelesProductos";
import "./Catalogo.css";

interface CartProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface CatalogoProps {
  onAddToCart: (product: CartProduct) => void;
  categoria?: string;
}

export default function Catalogo({ onAddToCart, categoria = "montaña" }: CatalogoProps) {
  const { products, loading, error } = useProducts(categoria);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bs-page-root">
      <header className="bs-header-section">
        <h1>{categoria.charAt(0).toUpperCase() + categoria.slice(1)} 🚴‍♂️</h1>
        <p>¡Bienvenido a Bike Store! Descubre productos pensados para potenciar tu ruta y llevar tu experiencia al siguiente nivel.</p>
      </header>

      <main id="bikeStore-main">
        <Productos products={products} onAddToCart={onAddToCart} />
      </main>
    </div>
  );
}

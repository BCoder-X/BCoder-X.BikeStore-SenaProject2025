import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "../../types/Product";
import "./PanelesProductos.css";

interface ProductosProps {
  products: Product[];
  onAddToCart: (product: {
    id: number;
    name: string;
    price: number;
    image: string;
  }) => void;
}

export default function Productos({
  products,
  onAddToCart,
}: ProductosProps) {
  const navigate = useNavigate();

  // -----------------------------
  // ESTADOS DE FILTROS
  // -----------------------------
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [brand, setBrand] = useState<string>("all");

  // -----------------------------
  // MARCAS DISPONIBLES DINÁMICAS
  // -----------------------------
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.marca) set.add(p.marca);
    });
    return Array.from(set);
  }, [products]);

  // -----------------------------
  // FILTRO + ORDENAMIENTO
  // -----------------------------
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filtro por marca
    if (brand !== "all") {
      result = result.filter((p) => p.marca === brand);
    }

    // Orden por precio
    result.sort((a, b) =>
      order === "asc" ? a.precio - b.precio : b.precio - a.precio
    );

    return result;
  }, [products, order, brand]);

  return (
    <section className="bs-featured-products">

      {/* =============================
         FILTROS
      ============================== */}
      <div className="bs-filters">

        {/* Filtro Marca */}
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="bs-filter-select"
        >
          <option value="all">Todas las marcas</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {/* Orden por precio */}
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
          className="bs-filter-select"
        >
          <option value="asc">Precio: menor a mayor</option>
          <option value="desc">Precio: mayor a menor</option>
        </select>
      </div>

      {/* =============================
         GRID PRODUCTOS
      ============================== */}
      <div className="bs-product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <article key={product.id_producto} className="bs-product-card">
              <img
                src={product.image}
                alt={product.nombre}
                loading="lazy"
              />

              <div className="bs-product-info">
                <h3>{product.nombre}</h3>

                <p className="bs-price">
                  {product.precio.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
                </p>

                <div className="bs-product-actions">
                  <button
                    className="bs-btn-add-cart"
                    onClick={() =>
                      onAddToCart({
                        id: product.id_producto,
                        name: product.nombre,
                        price: product.precio,
                        image: product.image,
                      })
                    }
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p>No hay productos disponibles con esos filtros.</p>
        )}
      </div>
    </section>
  );
}

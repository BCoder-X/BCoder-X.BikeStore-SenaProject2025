import { useEffect, useState } from "react";
import type { Product } from "../types/Product";

// Normalizar acentos: montaña -> montana
function normalizeCategory(cat: string) {
  return cat
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function useProducts(categoria: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoria || categoria.trim() === "") return;

    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const cat = normalizeCategory(categoria);
        const url = `http://localhost:3000/api/productos/${encodeURIComponent(cat)}`;

        const res = await fetch(url, { signal: controller.signal });

        if (!res.ok) {
          throw new Error(
            `Error al obtener productos (${res.status}): ${res.statusText}`
          );
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("La respuesta del servidor no es un arreglo válido.");
        }

        const mapped: Product[] = data.map((p) => ({
          id_producto: Number(p.id_producto),
          nombre: p.nombre ?? "",
          precio: Number(p.precio),
          image: p.image ?? "",
          descripcion: p.descripcion ?? "",
          marca: p.marca ?? "",
          categoria: p.categoria ?? "",
          stock: Number(p.stock),
          stock_minimo: Number(p.stock_minimo),
        }));

        setProducts(mapped);

      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message);
        } else if (!(err instanceof Error)) {
          setError("Error desconocido.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [categoria]);

  return { products, loading, error };
}

export interface Product {
  id_producto: number;      // coincide con la BD
  nombre: string;           // nombre del producto
  precio: number;           // DECIMAL en BD → number en TS
  image: string;            // LONGTEXT → string
  descripcion: string;      // descripción del producto
  marca: string;            // marca
  categoria: string;        // categoría
  stock: number;            // stock actual
  stock_minimo: number;     // stock mínimo permitido
}

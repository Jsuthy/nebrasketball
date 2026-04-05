"use client";

import ProductMasonryCard from "./ProductMasonryCard";
import type { ShopProduct } from "./ProductMasonryCard";

interface MasonryGridProps {
  products: ShopProduct[];
  onProductClick: (product: ShopProduct) => void;
  cols: number;
}

export default function MasonryGrid({
  products,
  onProductClick,
  cols,
}: MasonryGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 16,
        padding: 16,
      }}
    >
      {products.map((product) => (
        <ProductMasonryCard
          key={product.id}
          product={product}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
}

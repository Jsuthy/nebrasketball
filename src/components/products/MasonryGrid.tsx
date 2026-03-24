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
        columnCount: cols,
        columnGap: 3,
        padding: 3,
        ["--cols" as string]: cols,
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

"use client";

import { useState, useEffect } from "react";

export function useProducts() {
  const [products, setProducts] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: fetch products from Supabase
    setLoading(false);
  }, []);

  return { products, loading };
}

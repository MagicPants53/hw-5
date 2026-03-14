"use client";

import { useCallback } from "react";

import ProductStore from "@/shared/store/ProductStore";

export const useProductsUrlSync = (productStore: ProductStore) => {
  const syncUrl = useCallback(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams();
    params.set("page", String(productStore.currentPage));
    params.set("limit", String(productStore.pageSize));

    if (productStore.searchTerm) {
      params.set("search", productStore.searchTerm);
    }

    if (productStore.selectedCategoryTitles.length > 0) {
      params.set(
        "categories",
        productStore.selectedCategoryTitles.join(","),
      );
    }

    const search = params.toString();
    const pathname = window.location.pathname;
    const newUrl = search ? `${pathname}?${search}` : pathname;

    window.history.replaceState(null, "", newUrl);
  }, [
    productStore.currentPage,
    productStore.pageSize,
    productStore.searchTerm,
    productStore.selectedCategoryTitles,
  ]);

  return { syncUrl };
};


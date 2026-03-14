"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { useDebouncedCallback, useProductsUrlSync } from "@/app/_hooks";
import { Option } from "@/app/products/_components/MultiDropdown/MultiDropdown";
import { useCart } from "@/shared/store/RootStore/hooks/useCart";
import ProductStore from "@/shared/store/ProductStore";
import type { ProductType } from "@/shared/types/product";

export const useProductsController = (productStore: ProductStore) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { syncUrl } = useProductsUrlSync(productStore);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    productStore.setSearchTerm(value);
    syncUrl();
  }, 500);

  const debouncedSetCategories = useDebouncedCallback(
    (categoryIds: number[]) => {
      productStore.setCategories(categoryIds);
      syncUrl();
    },
    500,
  );

  const handleSearch = useCallback(
    (value: string) => {
      productStore.setSearchTermValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch, productStore],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      productStore.setCurrentPage(page);
      syncUrl();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    [productStore, syncUrl],
  );

  const handleCategoriesChange = useCallback(
    (selectedOptions: Option[]) => {
      const categoryIds = selectedOptions.map((option) => Number(option.key));
      productStore.setCategoriesValue(categoryIds);
      debouncedSetCategories(categoryIds);
    },
    [debouncedSetCategories, productStore],
  );

  const handleAddToCart = useCallback(
    (product: ProductType) => (e: React.MouseEvent) => {
      e.stopPropagation();
      addToCart(product, 1);
    },
    [addToCart],
  );

  const handleProductClick = useCallback(
    (product: ProductType) => {
      router.push(`/products/${product.documentId}`);
    },
    [router],
  );

  const clearFilters = useCallback(() => {
    productStore.clearCategories();
    productStore.setSearchTerm("");
    syncUrl();
  }, [productStore, syncUrl]);

  return {
    handleSearch,
    handlePageChange,
    handleCategoriesChange,
    handleAddToCart,
    handleProductClick,
    clearFilters,
  };
};


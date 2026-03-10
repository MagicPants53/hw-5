import qs from "qs";

import ProductsClient from "./ProductsClient";

import { apiUrls } from "@/shared/config/apiUrls";
import { Meta } from "@/shared/utils/meta";
import { mapRawProductsToList } from "@/shared/utils/productMapper";
import type { ProductCategory } from "@/shared/types/product";
import type { ProductStoreHydration } from "@/shared/store/ProductStore/ProductStore";
import { Metadata } from "next";

type RawCategory = {
  id: number;
  documentId: string;
  title: string;
};

export const metadata: Metadata = {
  title: "Lalasia | Products",
  description: "Lalasia furniture store",
};

async function getCategories(): Promise<ProductCategory[]> {
  const res = await fetch(apiUrls.productCategories(), {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error("Categories fetch failed");
  }
  const json = await res.json();
  return (json.data as RawCategory[]).map((raw) => ({
    id: raw.id,
    documentId: raw.documentId,
    title: raw.title,
  }));
}

async function getProducts(params: {
  page: number;
  limit: number;
  search: string;
  categoryIds: number[];
}) {
  const query = qs.stringify({
    populate: ["images", "productCategory"],
    pagination: { page: params.page, pageSize: params.limit },
    filters: {
      ...(params.search ? { title: { $containsi: params.search } } : null),
      ...(params.categoryIds.length > 0
        ? { productCategory: { id: { $in: params.categoryIds } } }
        : null),
    },
  });

  const res = await fetch(apiUrls.products(query), {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Products fetch failed");
  return res.json();
}

type ProductsPageSearchParams = {
  page?: string;
  limit?: string;
  search?: string;
  categories?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductsPageSearchParams>;
}) {
  const resolved = await searchParams;

  const page = resolved.page ? Number(resolved.page) : 1;
  const limit = resolved.limit ? Number(resolved.limit) : 9;
  const search = resolved.search ?? "";

  const categoryTitles = resolved.categories
    ? resolved.categories.split(",").filter(Boolean)
    : [];

  let hydration: ProductStoreHydration = {
    products: [],
    amount: 0,
    meta: Meta.loading,
    searchTerm: search,
    currentPage: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: Number.isFinite(limit) && limit > 0 ? limit : 9,
    selectedCategoryIds: [],
    categoryList: [],
    categoryMeta: Meta.loading,
  };

  try {
    const categoryList = await getCategories();
    const selectedCategoryIds =
      categoryTitles.length > 0
        ? categoryList
            .filter((c) => categoryTitles.includes(c.title))
            .map((c) => c.id)
        : [];

    const productsJson = await getProducts({
      page: hydration.currentPage,
      limit: hydration.pageSize,
      search: hydration.searchTerm,
      categoryIds: selectedCategoryIds,
    });

    hydration = {
      ...hydration,
      categoryList,
      selectedCategoryIds,
      categoryMeta: Meta.success,
      products: mapRawProductsToList(productsJson.data),
      amount: productsJson.meta.pagination.total,
      meta: Meta.success,
    };
  } catch {
    hydration = {
      ...hydration,
      categoryMeta:
        hydration.categoryList.length > 0
          ? (Meta.success)
          : (Meta.error),
      meta: Meta.error,
    };
  }

  return <ProductsClient hydration={hydration} />;
}

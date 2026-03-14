import type { Metadata } from "next";

import { apiUrls } from "@/shared/config/apiUrls";
import type { ProductCategory } from "@/shared/types/product";

import Categories from "./Categories";
import qs from "qs";
import { Meta } from "@/shared/utils/meta";

type RawCategory = {
  id: number;
  documentId: string;
  title: string;
  image: { id: number; url: string };
};

export const metadata: Metadata = {
  title: "Lalasia | Categories",
  description: "Browse Lalasia furniture categories",
};

async function getCategories(): Promise<ProductCategory[]> {
  const query = qs.stringify({
    populate: ["image"],
  });

  const res = await fetch(apiUrls.productCategories(query), {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error("Categories fetch failed");
  }
  const json = await res.json();
  console.log("json", json);
  return (json.data as RawCategory[]).map((raw) => ({
    id: raw.id,
    documentId: raw.documentId,
    title: raw.title,
    image: raw.image,
  }));
}

export default async function ProductsPage() {
  let meta: Meta = Meta.initial;
  let data: ProductCategory[] = [];
  try {
    data = await getCategories();
    meta = Meta.success;
  } catch {
    meta = Meta.error;
  }

  return <Categories categoriesList={data} meta={meta} />;
}

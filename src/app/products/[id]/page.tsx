import type { Metadata } from "next";
import qs from "qs";

import { apiUrls } from "@/shared/config/apiUrls";
import type { ProductType } from "@/shared/types/product";
import { Meta } from "@/shared/utils/meta";
import { mapRawToProduct } from "@/shared/utils/productMapper";

import Product from "./Product";

type Props = { params: Promise<{ id: string }> };

async function getProduct(id: string) {
  const query = qs.stringify({
    populate: ["images", "productCategory"],
  });

  const res = await fetch(apiUrls.product(id, query), {
    next: { revalidate: 60 },
    cache: "force-cache",
  });

  if (!res.ok) throw new Error("Product not found");

  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const data = await getProduct(id);
    const product = mapRawToProduct(data.data);
    return {
      title: `Lalasia | ${product.title}`,
      description: product.description,
    };
  } catch {
    return { title: "Lalasia | Product" };
  }
}

const ProductPage = async ({ params }: Props) => {
  const { id } = await params;

  let product: ProductType | null = null;
  let meta: Meta = Meta.initial;

  try {
    const data = await getProduct(id);
    product = mapRawToProduct(data.data);
    meta = Meta.success;
  } catch {
    meta = Meta.error;
  }

  return (
    <Product key={id} id={id} initData={{ product, meta }} />
  );
};

export default ProductPage;

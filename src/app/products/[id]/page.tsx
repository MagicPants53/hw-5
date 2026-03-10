import { apiUrls } from "@/shared/config/apiUrls";
import qs from "qs";
import Product from "./Product";
import { ProductType } from "@/shared/types/product";
import { Meta } from "@/shared/utils/meta";
import { mapRawToProduct } from "@/shared/utils/productMapper";
import styles from "./Product.module.scss";
import Link from "next/link";
import ArrowDownIcon from "@/shared/components/icons/ArrowDownIcon";
import Text from "@/shared/components/Text";
import { paths } from "@/shared/config/paths";
import type { Metadata } from "next";

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

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

    const data = await getProduct(id);
    const product = mapRawToProduct(data.data);

    return {
      title: `Lalasia | ${product.title}`,
      description: product.description,
    };
}

const ProductPage = async ({ params }: Props) => {
  const { id } = await params;

  let product: ProductType | null = null;
  let meta: Meta = Meta.initial;

  try {
    const data = await getProduct(id);
    product = mapRawToProduct(data.data);
    meta = Meta.success;
  } catch (error) {
    console.error("Product fetch error:", error);
    meta = Meta.error;
  }

  if (meta === Meta.error || !product) {
    return (
      <div className={styles.error}>
        <Text view="title">Товар не найден</Text>
        <Link href={paths.products} className={styles.back_link}>
          <ArrowDownIcon style={{ transform: "rotate(90deg)" }} />
          <Text view="p-20">Назад к товарам</Text>
        </Link>
      </div>
    );
  }

  return <Product product={product} meta={meta} />;
};

export default ProductPage;

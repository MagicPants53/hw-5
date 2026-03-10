"use client";
import Text from "@/shared/components/Text";
import ArrowDownIcon from "@/shared/components/icons/ArrowDownIcon";
import ProductInfo from "./_components/ProductInfo";

import { paths } from "@/shared/config/paths";
import { Meta } from "@/shared/utils/meta";
import { ProductType } from "@/shared/types/product";
import styles from "./Product.module.scss";
import Link from "next/link";
import { useCart } from "@/shared/store/RootStore/hooks/useCart";

type Props = {
  product: ProductType;
  meta: Meta;
};

const Product = ({ product, meta }: Props) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className={styles.product}>
      <div className={styles.back_link}>
        <Link href={paths.products}>
          <ArrowDownIcon style={{ transform: "rotate(90deg)" }} />
          <Text view="p-20">Назад</Text>
        </Link>
      </div>
      <ProductInfo product={product} onAddToCart={handleAddToCart} />
    </div>
  );
};
export default Product;

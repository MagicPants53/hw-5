"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";

import { paths } from "@/shared/config/paths";
import Button from "@/shared/components/Button";
import Text from "@/shared/components/Text";
import type { ProductType } from "@/shared/types/product";

import Slider from "../Slider";
import styles from "./ProductInfo.module.scss";

type ProductInfoProps = {
  product: ProductType;
  onAddToCart: () => void;
};

const ProductInfo: FC<ProductInfoProps> = ({ product, onAddToCart }) => {
  const router = useRouter();

  const handleAddToCart = () => {
    onAddToCart()
    router.push(paths.cart);
  };

  return (
    <div className={styles.content}>
      <Slider imgPaths={product.images.map((img) => img.url)} />
      <div className={styles.info}>
        <Text view="title">{product.title}</Text>
        <Text view="p-20" color="secondary">
          {product.description}
        </Text>
        <Text view="title">${Number(product.price).toFixed(2)}</Text>
        <div className={styles.btns}>
          <Button onClick={handleAddToCart}>Buy Now</Button>
          <Button view="ghost" onClick={onAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;

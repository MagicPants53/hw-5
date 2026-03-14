"use client";

import Link from "next/link";
import { observer, useLocalObservable } from "mobx-react-lite";

import { paths } from "@/shared/config/paths";
import { useCart } from "@/shared/store/RootStore/hooks/useCart";
import SingleProductStore from "@/shared/store/SingleProductStore";
import type { ProductType } from "@/shared/types/product";
import Text from "@/shared/components/Text";
import ArrowDownIcon from "@/shared/components/icons/ArrowDownIcon";
import Loader from "@/shared/components/Loader";
import { Meta } from "@/shared/utils/meta";

import ProductInfo from "./_components/ProductInfo";
import styles from "./Product.module.scss";

type Props = {
  id: string;
  initData: {
    product: ProductType | null;
    meta: Meta;
  };
};

const Product = ({ id, initData }: Props) => {
  const singleProductStore = useLocalObservable(() =>
    SingleProductStore.fromInitialData(initData.product, initData.meta),
  );
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (singleProductStore.product) addToCart(singleProductStore.product, 1);
  };

  if (singleProductStore.meta === Meta.loading)
    return (
      <div className={styles.loader}>
        <Loader size="xl" />
      </div>
    );

  if (singleProductStore.meta === Meta.error)
    return (
      <div className={styles.product}>
        <div className={styles.back_link}>
          <Link href={paths.products}>
            <ArrowDownIcon style={{ transform: "rotate(90deg)" }} />
            <Text view="p-20">Назад</Text>
          </Link>
        </div>
        <Text view="title">Товар не найден</Text>
      </div>
    );

  if (singleProductStore.product)
    return (
      <div className={styles.product}>
        <div className={styles.back_link}>
          <Link href={paths.products}>
            <ArrowDownIcon style={{ transform: "rotate(90deg)" }} />
            <Text view="p-20">Назад</Text>
          </Link>
        </div>
        <ProductInfo
          product={singleProductStore.product}
          onAddToCart={handleAddToCart}
        />
      </div>
    );

  return null;
};

export default observer(Product);

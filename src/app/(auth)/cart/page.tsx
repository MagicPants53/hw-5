"use client";

import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";

import { useLockScroll } from "@/app/_hooks";
import Button from "@/shared/components/Button";
import DeleteIcon from "@/shared/components/icons/DeleteIcon";
import Loader from "@/shared/components/Loader";
import Text from "@/shared/components/Text";
import { useRootStore } from "@/shared/providers/StoreProvider";
import type { CartItem } from "@/shared/types/cartItem";
import { Meta } from "@/shared/utils/meta";

import DialogModal from "./_components/dialogModal";
import styles from "./Cart.module.scss";

const Cart: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [product, setProduct] = useState<CartItem>();
  const { cartStore } = useRootStore();
  const modalRef = useRef(null);

  useLockScroll(isOpen, () => setIsOpen(false), modalRef);

  if (cartStore.meta === Meta.loading)
    return (
      <div className={styles.cartPage}>
        <div className={styles.loader}>
          <Loader size="xl" />
        </div>
      </div>
    );

  if (cartStore.items.length === 0) {
    return (
      <div className={styles.cartPage}>
        <Text view="title">Cart is empty</Text>
        <Link href="/products">
          <Button>Go to Products</Button>
        </Link>
      </div>
    );
  }

  const handleChangeQuantity = (inc: boolean, item: CartItem) => {
    runInAction(() => {
      if (!inc && item.quantity - 1 <= 0) {
        setIsOpen(true);
        setProduct(item);
      } else {
        cartStore.updateQuantity(item.documentId, inc);
      }
    });
  };

  const handleRemoveItem = (item: CartItem) => {
    runInAction(() => {
      cartStore.removeItem(item.documentId);
    });
  };

  return (
    <div className={styles.cartPage}>
      <Text view="title">Cart ({cartStore.totalItems})</Text>

      <div className={styles.cartItems}>
        {cartStore.items.map((item) => (
          <div key={item.documentId} className={styles.cartItem}>
            <div className={styles.text}>
              <Text>{item.title}</Text>
              <Text>${(item.price * item.quantity).toFixed(2)}</Text>
            </div>
            <div className={styles.btns}>
              <div className={styles.quantityControls}>
                <Button
                  view="ghost"
                  onClick={() => handleChangeQuantity(false, item)}
                >
                  -
                </Button>
                <span>{item.quantity}</span>
                <Button
                  view="ghost"
                  onClick={() => handleChangeQuantity(true, item)}
                >
                  +
                </Button>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  setIsOpen(true);
                  setProduct(item);
                }}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.cartTotal}>
        <Text view="subtitle">Total: ${cartStore.totalPrice.toFixed(2)}</Text>
        <Button>Place an order</Button>
      </div>

      <DialogModal
        isOpen={isOpen}
        ref={modalRef}
        product={product}
        onClose={() => setIsOpen(false)}
        onRemove={() => {
          product ? handleRemoveItem(product) : null;
          setIsOpen(false);
        }}
      />
    </div>
  );
};

export default observer(Cart);

"use client";
import type { FC } from "react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { runInAction } from "mobx";

import { Meta } from "@/shared/utils/meta";

import styles from "./Cart.module.scss";
import Loader from "@/shared/components/Loader";
import Link from "next/link";
import Button from "@/shared/components/Button";
import Text from "@/shared/components/Text";
import { CartItem } from "@/shared/store/RootStore/CartStore/CartStore";
import DeleteIcon from "@/shared/components/icons/DeleteIcon";
import { useRootStore } from "@/shared/providers/StoreProvider";


const Cart: FC = () => {
  const { cartStore } = useRootStore();

  useEffect(() => {
    cartStore.loadCart();
  }, [cartStore]);

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
      if (inc) cartStore.updateQuantity(item.documentId, item.quantity + 1);
      else cartStore.updateQuantity(item.documentId, item.quantity - 1);
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
                onClick={() =>
                  runInAction(() => {
                    cartStore.removeItem(item.documentId);
                  })
                }
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
    </div>
  );
};

export default observer(Cart);

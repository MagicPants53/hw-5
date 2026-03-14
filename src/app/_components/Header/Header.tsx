"use client";

import { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";

import { useRootStore } from "@/shared/providers/StoreProvider";

import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";
import styles from "./Header.module.scss";

const Header = () => {
  const rootStore = useRootStore();
  const cartStore = rootStore.cartStore;
  const userStore = rootStore.userStore;
  const prevIsAuthRef = useRef(userStore.isAuth);

  useEffect(() => {
    if (!cartStore.hasBeenHydrated) {
      cartStore.loadCart();
    }
  }, [cartStore]);

  useEffect(() => {
    if (prevIsAuthRef.current !== userStore.isAuth) {
      prevIsAuthRef.current = userStore.isAuth;
      cartStore.loadCart();
    }
  }, [userStore.isAuth, cartStore]);

  return (
    <header className={styles.header}>
      <HeaderDesktop className={styles.header_desktop} />
      <HeaderMobile className={styles.header_mobile} />
    </header>
  );
};

export default observer(Header);

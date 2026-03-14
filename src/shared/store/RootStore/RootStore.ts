import type { CartItem } from "@/shared/types/cartItem";

import CartStore from "./CartStore";
import UserStore from "./UserStore";

export type RootStoreInitData = {
  cart?: CartItem[] | null;
};

export default class RootStore {
  userStore = new UserStore();
  cartStore: CartStore;

  constructor(initData?: RootStoreInitData) {
    this.cartStore = new CartStore(initData?.cart);
    this.cartStore.setUserStore(this.userStore);
  }

  static create(initData?: RootStoreInitData): RootStore {
    return new RootStore(initData);
  }
}

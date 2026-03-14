import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import qs from "qs";

import { apiUrls } from "@/shared/config/apiUrls";
import type { CartItem } from "@/shared/types/cartItem";
import type { ProductType } from "@/shared/types/product";
import { mapRawCartList, mapRawToCartItem } from "@/shared/utils/cartMapper";
import { Meta } from "@/shared/utils/meta";

import type UserStore from "../UserStore";

type PrivateFields = "_items" | "_meta" | "_totalPrice" | "_userStore" | "_hasBeenHydrated";

class CartStore {
  private _items: CartItem[] = [];
  private _meta: Meta = Meta.initial;
  private _totalPrice = 0;
  private _userStore: UserStore | null = null;
  private _hasBeenHydrated = false;

  constructor(initialItems?: CartItem[] | null) {
    makeObservable<CartStore, PrivateFields>(this, {
      _items: observable,
      _meta: observable,
      _totalPrice: observable,
      _userStore: observable.ref,
      _hasBeenHydrated: observable,

      items: computed,
      totalItems: computed,
      totalPrice: computed,
      meta: computed,
      hasBeenHydrated: computed,

      hydrate: action,
      addItem: action,
      removeItem: action,
      updateQuantity: action,
      loadCart: action,
    });
    if (initialItems != null && Array.isArray(initialItems)) {
      this._items = initialItems;
      this._meta = Meta.success;
      this._hasBeenHydrated = true;
      this.calculateTotal();
    }
  }

  setUserStore(userStore: UserStore) {
    runInAction(() => {
      this._userStore = userStore;
    });
  }

  get userStore() {
    return this._userStore;
  }

  get items() {
    return this._items;
  }
  get totalItems() {
    return this.items.reduce<number>((sum: number, item) => {
      return sum + item.quantity;
    }, 0);
  }
  get totalPrice() {
    return this._totalPrice;
  }
  get meta() {
    return this._meta;
  }

  get hasBeenHydrated(): boolean {
    return this._hasBeenHydrated;
  }

  hydrate(items: CartItem[]) {
    runInAction(() => {
      this._items = items;
      this._meta = Meta.success;
      this._hasBeenHydrated = true;
      this.calculateTotal();
    });
  }

  private CART_KEY = "guest_cart";

  private async loadGuestCart() {
    if (typeof window === "undefined") return;

    const cartJson = localStorage.getItem(this.CART_KEY);
    if (!cartJson) return;

    try {
      const data = JSON.parse(cartJson);
      const productsPromises = data.map(
        async (item: { documentId: string; quantity: number }) => {
          const query = qs.stringify({
            populate: ["images", "productCategory"],
          });

          const req = await fetch(apiUrls.product(item.documentId, query), {
            next: { revalidate: 60 },
            cache: "force-cache",
          });

          const res = await req.json();
          res.data.quantity = item.quantity;
          return mapRawToCartItem(res.data);
        },
      );

      const result = await Promise.all(productsPromises);
      runInAction(() => {
        this._items = result;
        this.calculateTotal();
      });
    } catch {
      throw new Error("Product not found");
    }
  }

  private saveGuestCart() {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      this.CART_KEY,
      JSON.stringify(
        this._items.map((item) => ({
          documentId: item.documentId,
          quantity: item.quantity,
        })),
      ),
    );
  }

  async loadCart() {
    if (!this.userStore?.isAuth) {
      this._items = [];
      this._totalPrice = 0;
      this.loadGuestCart();
      this._meta = Meta.success;
      return;
    }

    this._meta = Meta.loading;

    try {
      const response = await fetch(apiUrls.cart.list, {
        headers: {
          Authorization: `Bearer ${this.userStore.token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      this._items = mapRawCartList(data);
      this.calculateTotal();
      this._meta = Meta.success;
    } catch {
      this._meta = Meta.error;
    }
  }

  async addItem(product: ProductType, quantity = 1) {
    const key = product.id;

    if (this.userStore?.isAuth) {
      await fetch(apiUrls.cart.add, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.userStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: product.id,
          quantity,
        }),
      });
      await this.loadCart();
    } else {
      const existingIndex = this.items.findIndex(
        (item) => item.originalProductId === key,
      );
      if (existingIndex >= 0) {
        this._items[existingIndex].quantity += quantity;
      } else {
        this._items.push({
          originalProductId: key,
          documentId: product.documentId,
          quantity,
          price: product.price,
          title: product.title,
        });
      }
      this.calculateTotal();
      this.saveGuestCart();
    }
  }

  async removeItem(documentId: string) {
    if (this.userStore?.isAuth) {
      const item = this._items.find((item) => item.documentId === documentId);
      if (item) {
        await fetch(apiUrls.cart.remove, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.userStore.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product: item.originalProductId,
            quantity: item.quantity,
          }),
        });
        await this.loadCart();
      }
    } else {
      this._items = this._items.filter(
        (item) => item.documentId !== documentId,
      );
      this.calculateTotal();
      this.saveGuestCart();
    }
  }

  async updateQuantity(documentId: string, increment: boolean) {
    const item = this._items.find((item) => item.documentId === documentId);
    if (item) {
      if (increment) {
        item.quantity += 1;
        if (this.userStore?.isAuth) {
          await fetch(apiUrls.cart.add, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.userStore.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product: item.originalProductId,
              quantity: 1,
            }),
          });
        }
      } else {
        item.quantity -= 1;
        if (this.userStore?.isAuth) {
          await fetch(apiUrls.cart.remove, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${this.userStore.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product: item.originalProductId,
              quantity: 1,
            }),
          });
        }
      }

      this.calculateTotal();

      if (!this.userStore?.isAuth) {
        this.saveGuestCart();
      }
    }
  }

  private calculateTotal() {
    this._totalPrice = this._items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }
}

export default CartStore;

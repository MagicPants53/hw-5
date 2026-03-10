import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { Meta } from "@/shared/utils/meta";
import type UserStore from "../UserStore";
import { ProductType } from "@/shared/types/product";
import { apiUrls } from "@/shared/config/apiUrls";

export type CartItem = {
  id?: number;
  originalProductId: number;
  documentId: string;
  quantity: number;
  price: number;
  title: string;
  product?: ProductType;
};

type PrivateFields = "_items" | "_meta" | "_totalPrice" | "_userStore";

class CartStore {
  private _items: CartItem[] = [];
  private _meta: Meta = Meta.initial;
  private _totalPrice = 0;
  private _productsCache = new Map<number, ProductType>();
  private _userStore: UserStore | null = null;

  constructor() {
    makeObservable<CartStore, PrivateFields>(this, {
      _items: observable,
      _meta: observable,
      _totalPrice: observable,
      _userStore: observable.ref,

      items: computed,
      totalItems: computed,
      totalPrice: computed,
      meta: computed,

      addItem: action,
      removeItem: action,
      updateQuantity: action,
      loadCart: action,
    });

    this.loadGuestCart();
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

  private CART_KEY = "guest_cart";

  private loadGuestCart() {
    if (typeof window === "undefined") return;

    const cartJson = localStorage.getItem(this.CART_KEY);
    if (!cartJson) return;

    runInAction(() => {
      this._items = JSON.parse(cartJson);
      this.calculateTotal();
    });
  }

  private saveGuestCart() {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this._items));
  }

  async loadCart() {
    if (!this.userStore?.isAuth) {
      runInAction(() => {
        this._items = [];
        this._totalPrice = 0;
      });
      this.loadGuestCart();
      runInAction(() => {
        this._meta = Meta.success;
      });
      return;
    }

    runInAction(() => {
      this._meta = Meta.loading;
    });

    try {
      const response = await fetch(apiUrls.cart.list, {
        headers: {
          Authorization: `Bearer ${this.userStore.token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      runInAction(() => {
        this._items = data.map((item: CartItem) => ({
          id: item.id,
          originalProductId: item.originalProductId,
          documentId: item.documentId,
          quantity: item.quantity,
          price: item.product?.price || 0,
          title: item.product?.title || "",
        }));
        this.calculateTotal();
        this._meta = Meta.success;
      });
    } catch {
      runInAction(() => {
        this._meta = Meta.error;
      });
    }
  }

  async addItem(product: ProductType, quantity = 1) {
    const key = product.id;
    this._productsCache.set(key, product);

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
      runInAction(() => {
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
      });
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
      runInAction(() => {
        this._items = this._items.filter(
          (item) => item.documentId !== documentId,
        );
        this.calculateTotal();
        this.saveGuestCart();
      });
    }
  }

  updateQuantity(documentId: string, quantity: number) {
    const item = this._items.find((item) => item.documentId === documentId);
    if (item && quantity > 0) {
      item.quantity = quantity;
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

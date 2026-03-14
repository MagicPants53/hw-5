import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import qs from "qs";

import { apiUrls } from "@/shared/config/apiUrls";
import type { ProductType } from "@/shared/types/product";
import { mapRawToProduct } from "@/shared/utils/productMapper";
import { Meta } from "@/shared/utils/meta";

type PrivateFields = "_product" | "_meta" | "_hasBeenHydrated";

class SingleProductStore {
  private _product: ProductType | null = null;
  private _meta: Meta = Meta.initial;
  private _hasBeenHydrated = false;

  constructor() {
    makeObservable<SingleProductStore, PrivateFields>(this, {
      _product: observable.ref,
      _meta: observable,
      _hasBeenHydrated: observable,

      product: computed,
      meta: computed,
      hasBeenHydrated: computed,
      hydrate: action,
      getProduct: action,
    });
  }

  get product(): ProductType | null {
    return this._product;
  }

  get meta(): Meta {
    return this._meta;
  }

  get hasBeenHydrated(): boolean {
    return this._hasBeenHydrated;
  }

  static fromInitialData(
    product: ProductType | null,
    meta: Meta,
  ): SingleProductStore {
    const store = new SingleProductStore();
    store.hydrate(product, meta);
    return store;
  }

  hydrate(product: ProductType | null, meta: Meta) {
    runInAction(() => {
      this._product = product;
      this._meta = meta;
      this._hasBeenHydrated = true;
    });
  }

  async getProduct(id: string) {
    this._meta = Meta.loading;
    this._product = null;

    const query = qs.stringify({
      populate: ["images", "productCategory"],
    });

    try {
      const response = await fetch(apiUrls.product(id, query), {
        next: { revalidate: 60 },
        cache: "force-cache",
      });
      const result = await response.json();
      runInAction(() => {
        if (response.ok) {
          this._meta = Meta.success;
          this._product = mapRawToProduct(result.data);
        } else {
          this._meta = Meta.error;
        }
      });
    } catch {
      runInAction(() => {
        this._meta = Meta.error;
      });
    }
  }
}

export default SingleProductStore;

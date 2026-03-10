import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import { Meta } from "@/shared/utils/meta";
import { mapRawProductsToList } from "@/shared/utils/productMapper";
import { mapRawCategoryToList } from "@/shared/utils/categoryMapper";
import { ProductCategory, ProductType } from "@/shared/types/product";
import { apiUrls } from "@/shared/config/apiUrls";
import { ApiConfig } from "@/shared/types/apiConfig";
import { UserParams } from "@/shared/types/userParams";
import qs from "qs";

type PrivateFields =
  | "_products"
  | "_amount"
  | "_meta"
  | "_searchTerm"
  | "_currentPage"
  | "_pageSize"
  | "_categoryList"
  | "_selectedCategoryIds"
  | "_categoryMeta";

export type ProductStoreHydration = {
  products: ProductType[];
  amount: number;
  meta: Meta;
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  selectedCategoryIds: number[];
  categoryList: ProductCategory[];
  categoryMeta: Meta;
};

class ProductStore {
  private _products: ProductType[] = [];
  private _amount = 0;
  private _meta: Meta = Meta.initial;
  private _searchTerm = "";
  private _currentPage = 1;
  private _pageSize = 9;
  private _selectedCategoryIds: number[] = [];
  private _categoryList: ProductCategory[] = [];
  private _categoryMeta: Meta = Meta.initial;

  constructor() {
    makeObservable<ProductStore, PrivateFields>(this, {
      _products: observable.ref,
      _amount: observable,
      _meta: observable,
      _searchTerm: observable,
      _currentPage: observable,
      _pageSize: observable,
      _selectedCategoryIds: observable.ref,
      _categoryList: observable.ref,
      _categoryMeta: observable,

      products: computed,
      amount: computed,
      meta: computed,
      searchTerm: computed,
      currentPage: computed,
      pageSize: computed,
      selectedCategoryIds: computed,
      categoryList: computed,
      categoryMeta: computed,
      hasSelectedCategories: computed,

      hydrate: action,
      setSearchTermValue: action,
      setCategoriesValue: action,
      clearCategoriesValue: action,
      setCurrentPageValue: action,
      setPageSizeValue: action,

      getProductsCategories: action,
      setCategories: action,
      clearCategories: action,
      setSearchTerm: action,
      setCurrentPage: action,
      setPageSize: action,
      getProducts: action,
    });
  }

  get products(): ProductType[] {
    return this._products;
  }

  get amount(): number {
    return this._amount;
  }

  get meta(): Meta {
    return this._meta;
  }

  get searchTerm(): string {
    return this._searchTerm;
  }

  get currentPage(): number {
    return this._currentPage;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  get selectedCategoryIds(): number[] {
    return this._selectedCategoryIds;
  }

  get categoryList(): ProductCategory[] {
    return this._categoryList;
  }

  get categoryMeta(): Meta {
    return this._categoryMeta;
  }

  get hasSelectedCategories(): boolean {
    return this._selectedCategoryIds.length > 0;
  }

  get selectedCategoryTitles(): string[] {
    return this._selectedCategoryIds
      .map((id) => this._categoryList.find((cat) => cat.id === id)?.title)
      .filter(Boolean) as string[];
  }

  hydrate(payload: ProductStoreHydration) {
    runInAction(() => {
      this._products = payload.products;
      this._amount = payload.amount;
      this._meta = payload.meta;
      this._searchTerm = payload.searchTerm;
      this._currentPage = payload.currentPage;
      this._pageSize = payload.pageSize;
      this._selectedCategoryIds = payload.selectedCategoryIds;
      this._categoryList = payload.categoryList;
      this._categoryMeta = payload.categoryMeta;
    });
  }

  setSearchTermValue(term: string) {
    runInAction(() => {
      this._searchTerm = term;
      this._currentPage = 1;
    });
  }

  setCategoriesValue(categoryIds: number[]) {
    runInAction(() => {
      this._selectedCategoryIds = categoryIds;
      this._currentPage = 1;
    });
  }

  clearCategoriesValue() {
    runInAction(() => {
      this._selectedCategoryIds = [];
      this._currentPage = 1;
    });
  }

  setCurrentPageValue(page: number) {
    runInAction(() => {
      this._currentPage = page;
    });
  }

  setPageSizeValue(size: number) {
    runInAction(() => {
      this._pageSize = size;
      this._currentPage = 1;
    });
  }

  async getProductsCategories() {
    this._categoryMeta = Meta.loading;
    this._categoryList = [];

    try {
      const response = await fetch(apiUrls.productCategories());
      const result = await response.json();

      runInAction(() => {
        if (response.ok) {
          try {
            this._categoryList = mapRawCategoryToList(result.data);
            this._categoryMeta = Meta.success;
          } catch {
            this._categoryMeta = Meta.error;
            this._categoryList = [];
          }
        } else {
          this._categoryMeta = Meta.error;
        }
      });
    } catch {
      runInAction(() => {
        this._categoryMeta = Meta.error;
        this._categoryList = [];
      });
    }
  }

  setCategories(categoryIds: number[]) {
    runInAction(() => {
      this._selectedCategoryIds = categoryIds;
      this._currentPage = 1;
    });
    this.getProducts();
  }

  clearCategories() {
    runInAction(() => {
      this._selectedCategoryIds = [];
      this._currentPage = 1;
    });
    this.getProducts();
  }

  setSearchTerm(term: string) {
    runInAction(() => {
      this._searchTerm = term;
      this._currentPage = 1;
    });
    this.getProducts();
  }

  setCurrentPage(page: number) {
    runInAction(() => {
      if (this._currentPage === page) return;
      this._currentPage = page;
    });
    this.getProducts();
  }

  setPageSize(size: number) {
    runInAction(() => {
      this._pageSize = size;
      this._currentPage = 1;
    });
    this.getProducts();
  }

  // Из читаемых params → Api
  private mapUserParamsToStrapi(userParams?: UserParams): ApiConfig {
    const page = userParams?.page ?? this._currentPage;
    const limit = userParams?.limit ?? this._pageSize;
    const search = userParams?.search ?? this._searchTerm;
    const categoryIds = userParams?.categories ?? this._selectedCategoryIds;

    const config: ApiConfig = {
      populate: ["images", "productCategory"],
      pagination: { page, pageSize: limit },
    };

    if (search) {
      config.filters = { title: { $containsi: search } };
    }

    if (categoryIds.length > 0) {
      config.filters = {
        ...config.filters,
        productCategory: {
          id: { $in: categoryIds },
        },
      };
    }

    return config;
  }

  async getProducts(userParams?: UserParams) {
    this._meta = Meta.loading;
    this._products = [];

    const strapiConfig = this.mapUserParamsToStrapi(
      userParams || {
        page: this._currentPage.toString(),
        limit: this._pageSize.toString(),
        search: this._searchTerm,
      },
    );

    const query = qs.stringify(strapiConfig);

    const response = await fetch(apiUrls.products(query), {
      method: "GET",
    });
    const result = await response.json();

    runInAction(() => {
      if (response.ok) {
        try {
          this._meta = Meta.success;
          this._amount = result.meta.pagination.total;
          this._products = mapRawProductsToList(result.data);
        } catch {
          this._meta = Meta.error;
          this._products = [];
        }
      } else {
        this._meta = Meta.error;
      }
    });
  }
}

export default ProductStore;

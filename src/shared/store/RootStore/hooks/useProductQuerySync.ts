"use client";
import { runInAction } from "mobx";
import ProductStore from "../../ProductStore";
import { UserParams } from "@/shared/types/userParams";
import { useRouter, usePathname } from "next/navigation";

export const useProductQuerySync = (productStore: ProductStore) => {
  const router = useRouter();
  const pathname = usePathname();

  const updateUrl = () => {
    runInAction(() => {
      const userParams: UserParams = {
        page: String(productStore.currentPage),
        limit: String(productStore.pageSize),
      };

      if (productStore.searchTerm) {
        userParams.search = productStore.searchTerm;
      }

      if (productStore.selectedCategoryTitles.length > 0) {
        userParams.categories = productStore.selectedCategoryTitles.join(",");
      }

      const queryString = new URLSearchParams(userParams).toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newUrl, { scroll: false });
    });
  };

  return { updateUrl };
};

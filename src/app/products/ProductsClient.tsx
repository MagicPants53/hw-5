"use client";

import { useCallback, useMemo } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";

import { useProductsController } from "@/app/_hooks";
import Text from "@/shared/components/Text";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import ProductStore, {
  type ProductStoreHydration,
} from "@/shared/store/ProductStore";
import { mapCategoryToOption } from "@/shared/utils/categoryMapper";
import { Meta } from "@/shared/utils/meta";

import Card from "./_components/Card";
import Pangination from "./_components/Pagination";
import MultiDropdown, { type Option } from "./_components/MultiDropdown";
import styles from "./Products.module.scss";

type ProductsClientProps = {
  initData: ProductStoreHydration;
};

const ProductsClient = ({ initData }: ProductsClientProps) => {
  const productStore = useLocalObservable(() =>
    ProductStore.fromHydration(initData),
  );
  const {
    handleSearch,
    handlePageChange,
    handleCategoriesChange,
    handleAddToCart,
    handleProductClick,
    clearFilters,
  } = useProductsController(productStore);

  const getCategoryTitle = useCallback((selectedOptions: Option[]): string => {
    if (selectedOptions.length === 0) {
      return "All categories";
    }

    if (selectedOptions.length === 1) {
      return selectedOptions[0].value;
    }
    if (selectedOptions.length === 2) {
      return selectedOptions
        .slice(0, 2)
        .map((option) => option.value)
        .join(", ");
    } else {
      return selectedOptions
        .slice(0, 2)
        .map((option) => option.value)
        .join(", ")
        .concat(` (+${selectedOptions.length - 2})`);
    }
  }, []);

  const categoryOptions: Option[] = useMemo(
    () => mapCategoryToOption(productStore.categoryList),
    [productStore.categoryList],
  );

  const selectedCategories: Option[] = useMemo(
    () =>
      categoryOptions.filter((opt) =>
        productStore.selectedCategoryIds.includes(Number(opt.key)),
      ),
    [categoryOptions, productStore.selectedCategoryIds],
  );

  const pageCount = Math.ceil(productStore.amount / productStore.pageSize);

  return (
    <>
      <div className={styles.subinfo}>
        <Text view="title">Products</Text>
        <Text view="p-20" color="secondary">
          We display products based on the latest products we have, if you want
          to see our old products please enter the name of the item
        </Text>
      </div>
      <div className={styles.controls}>
        <Input
          value={productStore.searchTerm}
          onChange={(value) => handleSearch(value)}
          placeholder="Search product..."
        />
        <MultiDropdown
          options={categoryOptions}
          value={selectedCategories}
          onChange={handleCategoriesChange}
          getTitle={getCategoryTitle}
          disabled={productStore.categoryMeta !== Meta.success}
          className={styles.categoryFilter}
        />
        {productStore.hasSelectedCategories && (
          <Button onClick={clearFilters} className={styles.clearButton}>
            Clean
          </Button>
        )}
      </div>

      <div className={styles.total}>
        <Text view="subtitle">Total products</Text>
        <Text view="p-20" color="accent" weight="bold">
          {productStore.amount}
        </Text>
      </div>
      <div className={styles.product_list}>
        {productStore.meta === Meta.loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={`skeleton-${index}`}
              image={""}
              title={""}
              subtitle={""}
              loading
            />
          ))}

        {productStore.meta !== Meta.loading &&
          productStore.products.map((product) => (
            <Card
              key={product.id}
              image={product.images[0].url}
              captionSlot={product.category.title}
              title={product.title}
              subtitle={product.description}
              contentSlot={"$" + product.price}
              actionSlot={
                <Button onClick={handleAddToCart(product)}>Add to Cart</Button>
              }
              onClick={() => handleProductClick(product)}
            />
          ))}
      </div>
      {productStore.meta === Meta.success && pageCount > 1 && (
        <Pangination
          pageCount={pageCount}
          selectedPage={productStore.currentPage}
          onChangePage={handlePageChange}
        />
      )}
    </>
  );
};

export default observer(ProductsClient);

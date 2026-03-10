"use client";

import { useCallback, useEffect } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";

import Card from "./_components/Card";
import Pangination from "./_components/Pagination";
import MultiDropdown, { type Option } from "./_components/MultiDropdown";

import { mapCategoryToOption } from "@/shared/utils/categoryMapper";
import { Meta } from "@/shared/utils/meta";
import styles from "./Products.module.scss";
import { useRouter } from "next/navigation";
import { useProductQuerySync } from "@/shared/store/RootStore/hooks/useProductQuerySync";
import ProductStore, {
  type ProductStoreHydration,
} from "@/shared/store/ProductStore";
import { ProductType } from "@/shared/types/product";
import Text from "@/shared/components/Text";
import Input from "@/shared/components/Input";
import Button from "@/shared/components/Button";
import { paths } from "@/shared/config/paths";
import { useCart } from "@/shared/store/RootStore/hooks/useCart";

type ProductsClientProps = {
  hydration: ProductStoreHydration;
};

const ProductsClient = ({ hydration }: ProductsClientProps) => {
  const productStore = useLocalObservable(() => new ProductStore());
  const { updateUrl } = useProductQuerySync(productStore);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    productStore.hydrate(hydration);
  }, [productStore, hydration]);

  const handleSearch = (value: string) => {
    productStore.setSearchTermValue(value);
    updateUrl();
  };

  const handlePageChange = (page: number) => {
    productStore.setCurrentPageValue(page);
    updateUrl();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCategoriesChange = (selectedOptions: Option[]) => {
    const categoryIds = selectedOptions.map((option) => Number(option.key));
    productStore.setCategoriesValue(categoryIds);
    updateUrl();
  };

  const handleAddToCart = (product: ProductType) => (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

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

  const clearFilters = () => {
    productStore.clearCategoriesValue();
    productStore.setSearchTermValue("");
    updateUrl();
  };

  const selectedCategories: Option[] = mapCategoryToOption(
    productStore.categoryList.filter((cat) =>
      productStore.selectedCategoryIds.includes(cat.id),
    ),
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
          options={mapCategoryToOption(productStore.categoryList)}
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
        {productStore.products.map((product) => (
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
            onClick={() =>
              router.push(`${paths.products}/${product.documentId}`)
            }
          />
        ))}
      </div>
      {productStore.meta === Meta.success && pageCount > 1 && (
        <Pangination
          pageCount={pageCount}
          selectedPage={productStore.currentPage}
          onChangePage={(page) => handlePageChange(page)}
        />
      )}
    </>
  );
};

export default observer(ProductsClient);


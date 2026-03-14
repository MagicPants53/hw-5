"use client";

import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";

import { ProductCategory } from "@/shared/types/product";
import Text from "@/shared/components/Text";

import styles from "./Categories.module.scss";
import { Meta } from "@/shared/utils/meta";
import qs from "qs";
import { apiUrls } from "@/shared/config/apiUrls";
import Loader from "@/shared/components/Loader";
import Error from "@/app/error";
import CategoryCard from "./_components/CategoryCard";

type CategoriesProps = {
  categoriesList: ProductCategory[];
  meta: Meta;
};

const Categories: FC<CategoriesProps> = ({ categoriesList, meta }) => {
  useEffect(() => {
    console.log(categoriesList, meta);
  }, [categoriesList, meta]);

  if (meta === Meta.loading)
    return (
      <div className={styles.loader}>
        <Loader size="xl" />
      </div>
    );

  if (meta === Meta.error)
    return Error({ reset: () => window.location.reload() });

  return (
    <>
      <div className={styles.subinfo}>
        <Text view="title">Categories</Text>
      </div>
      <div className={styles.categories}>
        {categoriesList.map((cat) => {
          return <CategoryCard title={cat.title} imageUrl={cat.image?.url} />;
        })}
      </div>
    </>
  );
};

export default observer(Categories);

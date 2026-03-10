import Card from "./_components/Card";

import Text from "@/shared/components/Text";

import styles from "./Products.module.scss";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lalasia | Loading",
  description: "Lalasia furniture store",
};

export default function Loading() {
  return (
    <>
      <div className={styles.subinfo}>
        <Text view="title">Products</Text>
        <Text view="p-20" color="secondary">
          We display products based on the latest products we have, if you want
          to see our old products please enter the name of the item
        </Text>
      </div>

      <div className={styles.product_list}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} image={""} title={""} subtitle={""} loading />
        ))}
      </div>
    </>
  );
}


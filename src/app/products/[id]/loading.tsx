import type { Metadata } from "next";

import Loader from "@/shared/components/Loader";

import styles from "./Product.module.scss";

export const metadata: Metadata = {
  title: "Lalasia | Loading",
  description: "Lalasia furniture store",
};

export default function Loading() {
  return (
    <div className={styles.loader}>
      <Loader size="xl" />
    </div>
  );
}


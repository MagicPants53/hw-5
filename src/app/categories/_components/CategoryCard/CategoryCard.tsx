import { FC } from "react";
import Image from "next/image";

import styles from "./CategoryCard.module.scss";
import Text from "@/shared/components/Text";
import Link from "next/link";
import { paths } from "@/shared/config/paths";

type CategoryCardProps = {
  title: string;
  imageUrl?: string;
};

const CategoryCard: FC<CategoryCardProps> = ({ title, imageUrl }) => {
  return (
    <Link
      className={styles.categoryCard}
      href={paths.products + `?categories=${title}`}
    >
      <div className={styles.containerImage}>
        {imageUrl && (
          <Image
            className={styles.image}
            src={imageUrl}
            alt={title}
            width={200}
            height={200}
          />
        )}
      </div>
      <Text view="subtitle">{title}</Text>
    </Link>
  );
};

export default CategoryCard;

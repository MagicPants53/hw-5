import type { FC } from "react";

import CartIcon from "@/shared/components/icons/CartIcon";
import UserIcon from "@/shared/components/icons/UserIcon";
import Text from "@/shared/components/Text";

import styles from "./Actions.module.scss";

type ActionsProps = {
  totalItems: number;
  isAuth: boolean;
  userInitials: string | null;
  onCartClick: () => void;
  onUserClick: () => void;
};

const Actions: FC<ActionsProps> = ({
  totalItems,
  isAuth,
  userInitials,
  onCartClick,
  onUserClick,
}) => {
  return (
    <div className={styles.actions}>
      <button onClick={onCartClick} className={styles.cartBtn} title="Корзина">
        <CartIcon />
        {totalItems > 0 && (
          <Text weight={"bold"} className={styles.cartBadge}>
            {totalItems}
          </Text>
        )}
      </button>

      <button onClick={onUserClick} className={styles.userBtn} title="Профиль">
        <UserIcon />
        {isAuth && userInitials && (
          <Text weight={"bold"} className={styles.userInitials}>
            {userInitials}
          </Text>
        )}
      </button>
    </div>
  );
};

export default Actions;

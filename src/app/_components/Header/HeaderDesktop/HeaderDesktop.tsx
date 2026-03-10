import { observer } from "mobx-react-lite";
import { useEffect, useState, type FC } from "react";
import { runInAction } from "mobx";

import AuthModal from "../../AuthModal/AuthModal";

import { Meta } from "@/shared/utils/meta";

import styles from "./HeaderDesktop.module.scss";
import { useRouter } from "next/navigation";
import { useLockScroll } from "@/app/_hooks";
import { paths } from "@/shared/config/paths";
import Link from "next/link";
import Logo from "@/shared/components/icons/Logo";
import { headersLinks } from "@/shared/config/headersLinks";
import Text from "@/shared/components/Text";
import CartIcon from "@/shared/components/icons/CartIcon";
import UserIcon from "@/shared/components/icons/UserIcon";
import { useRootStore } from "@/shared/providers/StoreProvider";

type HeaderDesktopProps = {
  className?: string;
};

const HeaderDesktop: FC<HeaderDesktopProps> = ({ className }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  const rootStore = useRootStore();
  const userStore = rootStore.userStore;
  const cartStore = rootStore.cartStore;

  useEffect(() => {
    cartStore.loadCart();
    setShowAuthModal(false);
  }, [userStore.isAuth]);

  useLockScroll(showAuthModal, () => setShowAuthModal(false));

  const handleUserClick = () => {
    runInAction(() => {
      if (userStore.isAuth) {
        router.push(paths.profile);
      } else {
        setShowAuthModal(true);
      }
    });
  };

  const handleCartClick = () => {
    runInAction(() => {
      router.push(paths.cart);
    });
  };

  return (
    <>
      <div className={className}>
        <div>
          <Link href="/">
            <Logo isLong />
          </Link>
        </div>

        <nav className={styles.tabs}>
          {headersLinks.map((link) => (
            <Link href={link.path} key={link.name}>
              <Text view="p-18">{link.name}</Text>
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            onClick={handleCartClick}
            className={styles.cartBtn}
            title="Корзина"
          >
            <CartIcon />
            {cartStore.totalItems > 0 && (
              <Text weight={"bold"} className={styles.cartBadge}>
                {cartStore.totalItems}
              </Text>
            )}
          </button>

          <button
            onClick={handleUserClick}
            className={styles.userBtn}
            title="Профиль"
          >
            <UserIcon />
            {userStore.isAuth && userStore.user && (
              <Text weight={"bold"} className={styles.userInitials}>
                {userStore.user.username.slice(0, 2).toUpperCase()}
              </Text>
            )}
          </button>
        </div>
      </div>

      {showAuthModal && userStore.meta !== Meta.success && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
};

export default observer(HeaderDesktop);

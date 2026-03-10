import Link from "next/link";

import { useEffect, useRef, useState, type FC } from "react";
import { runInAction } from "mobx";

import { Meta } from "@/shared/utils/meta";

import Modal from "../../Modal";
import AuthModal from "../../AuthModal";

import styles from "./HeaderMobile.module.scss";
import { observer } from "mobx-react-lite";
import { useLockScroll } from "@/app/_hooks";
import { useRouter } from "next/navigation";
import { paths } from "@/shared/config/paths";
import Logo from "@/shared/components/icons/Logo";
import BurgerIcon from "@/shared/components/icons/BurgerIcon";
import CartIcon from "@/shared/components/icons/CartIcon";
import Text from "@/shared/components/Text";
import UserIcon from "@/shared/components/icons/UserIcon";
import { headersLinks } from "@/shared/config/headersLinks";
import { useRootStore } from "@/shared/providers/StoreProvider";

type HeaderMobileProps = {
  className?: string;
};

const HeaderMobile: FC<HeaderMobileProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  const rootStore = useRootStore();
  const userStore = rootStore.userStore;
  const cartStore = rootStore.cartStore;

  useEffect(() => {
    cartStore.loadCart();
    setShowAuthModal(false);
  }, [userStore.isAuth]);

  useLockScroll(isMenuOpen, () => setIsMenuOpen(false), menuRef);
  useLockScroll(showAuthModal, () => setIsMenuOpen(false));

  const handleUserClick = () => {
    setIsMenuOpen(false);
    runInAction(() => {
      if (userStore.isAuth) {
        router.push(paths.profile);
      } else {
        setShowAuthModal(true);
      }
    });
  };

  const handleCartClick = () => {
    setIsMenuOpen(false);
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

        <button
          className={styles.burger_btn}
          onClick={() => setIsMenuOpen(true)}
        >
          <BurgerIcon color="accent" />
        </button>

        <Modal isOpen={isMenuOpen} ref={menuRef}>
          <div className={styles.icons}>
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Logo />
            </Link>
            <div className={styles.modal_actions}>
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
          <nav className={styles.modal_tabs}>
            {headersLinks.map((link) => (
              <Link
                href={link.path}
                key={link.name}
                onClick={() => setIsMenuOpen(false)}
              >
                <Text view="p-20">{link.name}</Text>
              </Link>
            ))}
          </nav>
        </Modal>
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

export default observer(HeaderMobile);

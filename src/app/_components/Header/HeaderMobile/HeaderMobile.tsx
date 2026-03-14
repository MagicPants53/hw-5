import Link from "next/link";
import { useEffect, useRef, useState, type FC } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

import { useLockScroll } from "@/app/_hooks";
import { paths } from "@/shared/config/paths";
import { headersLinks } from "@/shared/config/headersLinks";
import BurgerIcon from "@/shared/components/icons/BurgerIcon";
import Logo from "@/shared/components/icons/Logo";
import Modal from "@/shared/components/Modal";
import Text from "@/shared/components/Text";
import { useRootStore } from "@/shared/providers/StoreProvider";
import { Meta } from "@/shared/utils/meta";

import Actions from "../Actions";
import AuthModal from "../../AuthModal";
import styles from "./HeaderMobile.module.scss";

type HeaderMobileProps = {
  className?: string;
};

const HeaderMobile: FC<HeaderMobileProps> = ({ className }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const router = useRouter();
  const menuRef = useRef(null);
  const modalRef = useRef(null);

  const rootStore = useRootStore();
  const userStore = rootStore.userStore;
  const cartStore = rootStore.cartStore;

  useEffect(() => {
    setShowAuthModal(false);
  }, [userStore.isAuth]);

  useLockScroll(showAuthModal, () => setShowAuthModal(false), modalRef);
  useLockScroll(isMenuOpen, () => setIsMenuOpen(false), menuRef);

  const handleUserClick = () => {
    setIsMenuOpen(false);
    if (userStore.isAuth) {
      router.push(paths.profile);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleCartClick = () => {
    setIsMenuOpen(false);
    router.push(paths.cart);
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

        <Modal isOpen={isMenuOpen} ref={menuRef} position="right">
          <div className={styles.icons}>
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Logo />
            </Link>

            <Actions
              totalItems={cartStore.totalItems}
              isAuth={userStore.isAuth}
              userInitials={
                userStore.user
                  ? userStore.user.username.slice(0, 2).toUpperCase()
                  : null
              }
              onCartClick={handleCartClick}
              onUserClick={handleUserClick}
            />
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
        <AuthModal isOpen={showAuthModal} ref={modalRef} />
      )}
    </>
  );
};

export default observer(HeaderMobile);

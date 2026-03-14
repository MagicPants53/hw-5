import Link from "next/link";
import { useEffect, useRef, useState, type FC } from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";

import { useLockScroll } from "@/app/_hooks";
import { paths } from "@/shared/config/paths";
import { headersLinks } from "@/shared/config/headersLinks";
import Logo from "@/shared/components/icons/Logo";
import Text from "@/shared/components/Text";
import { useRootStore } from "@/shared/providers/StoreProvider";
import { Meta } from "@/shared/utils/meta";

import AuthModal from "../../AuthModal/AuthModal";
import Actions from "../Actions";
import styles from "./HeaderDesktop.module.scss";

type HeaderDesktopProps = {
  className?: string;
};

const HeaderDesktop: FC<HeaderDesktopProps> = ({ className }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const modalRef = useRef(null);
  const router = useRouter();

  const rootStore = useRootStore();
  const userStore = rootStore.userStore;
  const cartStore = rootStore.cartStore;

  useEffect(() => {
    setShowAuthModal(false);
  }, [userStore.isAuth]);

  useLockScroll(showAuthModal, () => setShowAuthModal(false), modalRef);

  const handleUserClick = () => {
    if (userStore.isAuth) {
      router.push(paths.profile);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleCartClick = () => {
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

        <nav className={styles.tabs}>
          {headersLinks.map((link) => (
            <Link href={link.path} key={link.name}>
              <Text view="p-18">{link.name}</Text>
            </Link>
          ))}
        </nav>

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

      {showAuthModal && userStore.meta !== Meta.success && (
        <AuthModal isOpen={showAuthModal} ref={modalRef} />
      )}
    </>
  );
};

export default observer(HeaderDesktop);

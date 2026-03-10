"use client";
import HeaderMobile from "./HeaderMobile";
import HeaderDesktop from "./HeaderDesktop";

import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <HeaderDesktop className={styles.header_desktop} />
      <HeaderMobile className={styles.header_mobile} />
    </header>
  );
};

export default Header;

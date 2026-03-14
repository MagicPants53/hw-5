"use client";
import { type FC } from "react";

import styles from "./Modal.module.scss";

enum Position {}

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  ref?: React.RefObject<HTMLDivElement | null>;
  position?: "center" | "right";
};

const Modal: FC<ModalProps> = ({
  isOpen,
  ref,
  children,
  position = "center",
}) => {
  return (
    <div
      className={`${styles.modal} ${isOpen ? styles.open : ""} ${position === "center" ? styles.center : styles.right}`}
      ref={ref}
    >
      <div className={styles.modal_content}>{children}</div>
    </div>
  );
};

export default Modal;

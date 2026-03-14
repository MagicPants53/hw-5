import type { FC } from "react";

import type { CartItem } from "@/shared/types/cartItem";
import Button from "@/shared/components/Button";
import Modal from "@/shared/components/Modal";
import Text from "@/shared/components/Text";

import styles from "./DialogModal.module.scss";

type DialogProps = {
  isOpen: boolean;
  product?: CartItem;
  ref?: React.RefObject<HTMLDivElement | null>;
  onRemove?: () => void;
  onClose: () => void;
};

const DialogModal: FC<DialogProps> = ({
  isOpen,
  product,
  ref,
  onClose,
  onRemove,
}) => {
  return (
    <Modal isOpen={isOpen} ref={ref}>
      <div className={styles.content}>
        <Text view="subtitle">Remove product</Text>
        <Text view="p-20">
          Are you sure you want to remove the product <br /> ({product?.title})?
        </Text>
        <div className={styles.actions}>
          <Button view="ghost" onClick={onRemove}>
            Yes
          </Button>
          <Button onClick={onClose}>No</Button>
        </div>
      </div>
    </Modal>
  );
};

export default DialogModal;

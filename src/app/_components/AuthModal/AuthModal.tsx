"use client";

import { useState, type FC } from "react";
import { observer } from "mobx-react-lite";

import { DEFAULT_FORM, FormDataType } from "@/shared/config/formDefaults";
import Modal from "@/shared/components/Modal";
import Text from "@/shared/components/Text";
import { useRootStore } from "@/shared/providers/StoreProvider";
import { Meta } from "@/shared/utils/meta";

import Form from "../Form";
import Button from "@/shared/components/Button";
import styles from "./AuthModal.module.scss";

type AuthModalProps = {
  isOpen: boolean;
  ref?: React.RefObject<HTMLDivElement | null>;
};

const AuthModalContent: FC<AuthModalProps> = ({ isOpen, ref }) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [form, setForm] = useState<FormDataType>(DEFAULT_FORM);

  const { userStore } = useRootStore();
  const meta = userStore.meta;
  const errorMsg = userStore.errorMsg;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      userStore.enter(form.email, form.password);
    } else {
      userStore.enter(form.email, form.password, form.username);
    }
  };

  return (
    <Modal isOpen={isOpen} position="center" ref={ref}>
      <Text view="title">{isLogin ? "Log in" : "Create an account"}</Text>

      <Form
        data={form}
        isLogin={isLogin}
        meta={meta}
        setData={setForm}
        onSubmit={(e) => handleSubmit(e)}
      />

      {meta === Meta.error && (
        <div className={styles.error}>
          <Text>{errorMsg}</Text>
        </div>
      )}

      <div className={styles.modalToggle}>
        <Text view="p-14" color="secondary">
          {isLogin ? "No account?" : "Have an account?"}
        </Text>
        <Button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create an account" : "Log in"}
        </Button>
      </div>
    </Modal>
  );
};

export default observer(AuthModalContent);

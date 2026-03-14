import type { FC } from "react";

import { FormDataType } from "@/shared/config/formDefaults";
import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";
import { Meta } from "@/shared/utils/meta";

import styles from "./Form.module.scss";

type FormProps = {
  data: FormDataType;
  isLogin: boolean;
  meta: Meta;
  setData: (data: FormDataType) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const Form: FC<FormProps> = ({ data, isLogin, meta, setData, onSubmit }) => {
  return (
    <form
      className={styles.form}
      onSubmit={(e: React.FormEvent) => onSubmit(e)}
    >
      {!isLogin && (
        <Input
          placeholder="Username"
          value={data.username}
          onChange={(value) => setData({ ...data, username: value })}
          autoComplete="username"
          required
        />
      )}

      <Input
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={(value) => setData({ ...data, email: value })}
        autoComplete={isLogin ? "email" : "email"}
        required
      />

      <Input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(value) => setData({ ...data, password: value })}
        autoComplete={isLogin ? "current-password" : "new-password"}
        required
      />

      <Button
        type="submit"
        disabled={meta === Meta.loading || !data.email || !data.password}
        loading={meta === Meta.loading}
      >
        {meta === Meta.loading ? "Loading..." : isLogin ? "Log in" : "Register"}
      </Button>
    </form>
  );
};

export default Form;

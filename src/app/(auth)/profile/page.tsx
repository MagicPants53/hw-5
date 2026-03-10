"use client";
import type { FC } from "react";
import { runInAction } from "mobx";

import styles from "./Profile.module.scss";
import { useRouter } from "next/navigation";
import Button from "@/shared/components/Button";
import Text from "@/shared/components/Text";
import { useRootStore } from "@/shared/providers/StoreProvider";

const Profile: FC = () => {
  const { userStore } = useRootStore();
  const router = useRouter();

  const handleClick = () => {
    runInAction(() => {
      userStore.logout();
      router.push(`/`);
    });
  };

  return (
    <div className={styles.profile}>
      <Text view="title">Profile ({userStore.user?.username})</Text>
      <Text view="p-20" color="secondary">
        {userStore.user?.email}
      </Text>
      <Button onClick={handleClick}>Log out</Button>
    </div>
  );
};

export default Profile;

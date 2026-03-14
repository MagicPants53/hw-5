"use client";

import type { FC } from "react";
import { useRouter } from "next/navigation";
import { runInAction } from "mobx";

import Button from "@/shared/components/Button";
import Text from "@/shared/components/Text";
import { useRootStore } from "@/shared/providers/StoreProvider";

import styles from "./Profile.module.scss";

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

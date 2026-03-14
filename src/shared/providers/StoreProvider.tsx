"use client";

import React, { useRef } from "react";

import { useStrictContext } from "@/shared/store/useStrictContext";
import RootStore from "@/shared/store/RootStore/RootStore";
import type { RootStoreInitData } from "@/shared/store/RootStore/RootStore";

type StoreProviderProps = {
  children: React.ReactNode;
  initData?: RootStoreInitData;
};

type RootStoreContextValue = RootStore;

const RootStoreContext = React.createContext<RootStoreContextValue | null>(null);

export const StoreProvider: React.FC<StoreProviderProps> = ({
  children,
  initData,
}) => {
  const storeRef = useRef<RootStore | null>(null);

  if (storeRef.current === null) {
    storeRef.current = RootStore.create(initData);
  }

  return (
    <RootStoreContext.Provider value={storeRef.current}>
      {children}
    </RootStoreContext.Provider>
  );
};

export const useRootStore = () => {
  return useStrictContext({
    context: RootStoreContext,
    message: "RootStoreContext was not provided",
  });
};


"use client";

import React, { useRef } from "react";

import { useStrictContext } from "@/shared/store/useStrictContext";
import RootStore from "@/shared/store/RootStore/RootStore";

type StoreProviderProps = {
  children: React.ReactNode;
};

type RootStoreContextValue = RootStore;

const RootStoreContext = React.createContext<RootStoreContextValue | null>(null);

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const storeRef = useRef<RootStore | null>(null);

  if (storeRef.current === null) {
    storeRef.current = new RootStore();
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


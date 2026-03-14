"use client";
import React, { useRef } from "react";
import { useStrictContext } from "../useStrictContext";
import RootStore from "./RootStore";
import { useCreateRootStore } from "./useCreateRootStore";

type RootStoreContextValue = RootStore;

type RootStoreProviderProps = {
  children: React.ReactNode;
};

const RootStoreContext = React.createContext<RootStoreContextValue | null>(
  null,
);

let rootStoreInstance: RootStore | null = null;

export const RootStoreProvider: React.FC<RootStoreProviderProps> = ({
  children,
}) => {
  const storeRef = useRef(rootStoreInstance ?? useCreateRootStore());

  if (!rootStoreInstance) {
    rootStoreInstance = storeRef.current;
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

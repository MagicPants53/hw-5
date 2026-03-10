import { enableStaticRendering } from "mobx-react-lite";
import RootStore from "./RootStore";

const isServer = typeof window === "undefined";
enableStaticRendering(isServer);

let clientStore: RootStore | undefined;

export const useCreateRootStore = (): RootStore => {
  const initRootStore = (): RootStore => {
    return new RootStore();
  };

  let result: RootStore;

  if (isServer) {
    result = initRootStore();
  } else {
    clientStore = clientStore ?? initRootStore();
    result = clientStore;
  }
  return result;
};

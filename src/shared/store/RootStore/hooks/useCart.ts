import { useRootStore } from "@/shared/providers/StoreProvider";

export const useCart = () => {
  const { cartStore } = useRootStore();
  return {
    items: cartStore.items,
    totalItems: cartStore.totalItems,
    totalPrice: cartStore.totalPrice,
    addToCart: cartStore.addItem.bind(cartStore),
    removeFromCart: cartStore.removeItem.bind(cartStore),
  };
};

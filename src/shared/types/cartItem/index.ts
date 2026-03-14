import { ProductType } from "../product";

export type CartItem = {
  id?: number;
  originalProductId: number;
  documentId: string;
  quantity: number;
  price: number;
  title: string;
  product?: ProductType;
};

import { CartItem } from "../types/cartItem";
import { ProductType } from "../types/product";

type RawItem = {
  id: number;
  originalProductId: number;
  documentId: string;
  quantity: number;
  price: number;
  title: string;
  product?: ProductType;
};

export const mapRawToCartItem = (raw: RawItem): CartItem => ({
  id: raw.id,
  originalProductId: raw.originalProductId,
  documentId: raw.documentId,
  quantity: raw.quantity,
  price: raw.price ?? raw.product?.price,
  title: raw.title ?? raw.product?.title,
});

export const mapRawCartList = (raws: RawItem[]): CartItem[] =>
  raws.map(mapRawToCartItem);

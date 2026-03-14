import { cookies } from "next/headers";

import { apiUrls } from "@/shared/config/apiUrls";
import { mapRawCartList } from "@/shared/utils/cartMapper";
import type { CartItem } from "@/shared/types/cartItem";

const AUTH_TOKEN_COOKIE = "auth_token";

export async function getCartForLayout(): Promise<CartItem[] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    const res = await fetch(apiUrls.cart.list, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const list = Array.isArray(data) ? data : data?.data ?? [];
    return mapRawCartList(list);
  } catch {
    return null;
  }
}

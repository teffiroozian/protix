import type { MenuItem } from "@/types/menu";
import type { CartItem } from "@/stores/cartStore";
import { toItemSlug } from "@/lib/restaurants";

type CartItemModifyHrefOptions = {
  editOrigin?: string;
};

export function getCartItemModifyHref(
  cartItem: CartItem,
  sourceItem?: MenuItem | null,
  options?: CartItemModifyHrefOptions
) {
  const nextParams = new URLSearchParams({ editCartItem: cartItem.id });
  if (options?.editOrigin) {
    nextParams.set("editOrigin", options.editOrigin);
  }

  if (cartItem.buildConfiguration) {
    nextParams.set("view", "ingredients");
    return `/restaurant/${cartItem.restaurantId}?${nextParams.toString()}`;
  }

  if (!sourceItem) {
    return null;
  }

  return `/restaurant/${cartItem.restaurantId}/items/${toItemSlug(sourceItem)}?${nextParams.toString()}`;
}

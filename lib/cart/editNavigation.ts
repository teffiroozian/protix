import type { MenuItem } from "@/types/menu";
import type { CartItem } from "@/stores/cartStore";
import { toItemSlug } from "@/lib/restaurants";

export function getCartItemModifyHref(cartItem: CartItem, sourceItem?: MenuItem | null) {
  if (cartItem.buildConfiguration) {
    return `/restaurant/${cartItem.restaurantId}?view=ingredients&editCartItem=${cartItem.id}`;
  }

  if (!sourceItem) {
    return null;
  }

  return `/restaurant/${cartItem.restaurantId}/items/${toItemSlug(sourceItem)}?editCartItem=${cartItem.id}`;
}

import { redirect } from "next/navigation";

export default async function RestaurantsItemAliasPage({
  params,
}: {
  params: Promise<{ id: string; itemSlug: string }>;
}) {
  const { id, itemSlug } = await params;
  redirect(`/restaurant/${id}/items/${itemSlug}`);
}

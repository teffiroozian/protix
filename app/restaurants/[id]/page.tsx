import { redirect } from "next/navigation";

export default async function RestaurantsAliasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/restaurant/${id}`);
}

import { notFound } from "next/navigation";

export default async function ItemModalPage({
  params,
}: {
  params: Promise<{ id: string; itemSlug: string }>;
}) {
  await params;

  // TODO: Restore item route rendering after shared loader is added at `@/lib/restaurant-data-loader`.
  notFound();
}

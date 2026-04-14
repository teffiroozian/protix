import Link from "next/link";
import RestaurantView from "@/components/RestaurantView";
import RecentRestaurantTracker from "@/components/RecentRestaurantTracker";
import ScrollToTopOnMount from "@/components/ScrollToTopOnMount";
import { RestaurantSearchProvider } from "@/components/RestaurantSearchContext";
import { RestaurantUiProvider } from "@/components/RestaurantUiContext";
import CartPreviewDrawer from "@/components/CartPreviewDrawer";
import { getRestaurantData } from "@/lib/restaurants";

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const restaurantData = await getRestaurantData(id);

  if (!restaurantData) {
    return (
      <main style={{ maxWidth: 900, margin: "48px auto", padding: 16 }}>
        <Link href="/" style={{ textDecoration: "none", cursor: "pointer" }}>
          ← Back
        </Link>
        <h1 style={{ marginTop: 16 }}>Restaurant not found</h1>
      </main>
    );
  }

  return (
    <RestaurantSearchProvider>
      <RestaurantUiProvider>
        <div className="w-full pt-28 sm:pt-36">
          <RecentRestaurantTracker restaurantId={restaurantData.id} />
          <ScrollToTopOnMount />

          <main className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6">
            <RestaurantView
              restaurantId={restaurantData.id}
              restaurantName={restaurantData.name}
              restaurantLogo={restaurantData.logo}
              isBuildYourOwn={restaurantData.isBuildYourOwn}
              items={restaurantData.items}
              ingredients={restaurantData.ingredients}
              addons={restaurantData.addons}
              commonChanges={restaurantData.commonChanges}
              customizationRules={restaurantData.customizationRules}
              builderConfig={restaurantData.builderConfig}
            />
          </main>
        </div>
        <CartPreviewDrawer />
      </RestaurantUiProvider>
    </RestaurantSearchProvider>
  );
}

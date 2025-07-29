import { cache } from "react";
import { Suspense } from "react";
import { IListingFor } from "@/types";
import { extractSearchParams } from "@/utilits/extractSearchParams";
import { getAllFeature } from "@/services/feature";
import { getAllCategory } from "@/services/category";
import { getAllParkings } from "@/services/parking";
import ClientParkingTabs from "@/components/parking/ParkingCategory/ClientParkingTabs";
import ClientParkingView from "@/components/parking/ParkingList/ClientParkingView";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}
export interface ParkingPageProps {
  searchParams: Promise<SearchParams>;
}

const getCachedFeatures = cache(getAllFeature);
const getCachedCategories = cache(getAllCategory);
const getCachedParkings = cache(getAllParkings);

export default async function Parking({ searchParams }: ParkingPageProps) {
  const resolvedParams = await searchParams;
  const params = extractSearchParams(resolvedParams);

  try {
    const { data: features } = await getCachedFeatures();
    const featuresParkingID = features.find(
      (f: IListingFor) => f.featureName === "Parking"
    )?._id;

    if (!featuresParkingID) {
      return <div>No Parking feature found.</div>;
    }

    const [{ data: parkingCategories }, { data: parkings, total }] =
      await Promise.all([
        getCachedCategories(featuresParkingID),
        getCachedParkings({ ...params }),
      ]);
    const TabsSkeleton = () => (
      <div className="animate-pulse h-12 bg-gray-200 rounded mb-4" />
    );
    const ParkingGridSkeleton = () => (
      <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse h-64 bg-gray-200 rounded" />
        ))}
      </div>
    );

    return (
      <div className="Container mt-8 md:my-10">
        <Suspense fallback={<TabsSkeleton />}>
          <ClientParkingTabs params={resolvedParams} />
        </Suspense>
        <Suspense fallback={<ParkingGridSkeleton />}>
          <ClientParkingView
            parkings={parkings}
            total={total}
            currentPage={params.page}
            parkingCategories={parkingCategories}
            selectedCategoryId={params.categoryId || "all"}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Parking page error:", error);
    return <div className="text-red-500">Error loading parking listings.</div>;
  }
}

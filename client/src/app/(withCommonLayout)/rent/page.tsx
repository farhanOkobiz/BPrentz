import { cache } from "react";
import { Suspense } from "react";
import { IListingFor } from "@/types";
import { extractSearchParams } from "@/utilits/extractSearchParams";
import { getAllFeature } from "@/services/feature";
import { getAllCategory } from "@/services/category";
import { getAllRents } from "@/services/rents";
import ClientRentView from "@/components/rent/RentList/ClientRentView";
import ClientRentTabs from "@/components/rent/RentCategory/ClientRentTabs";

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}
export interface RentPageProps {
  searchParams: Promise<SearchParams>;
}

const getCachedFeatures = cache(getAllFeature);
const getCachedCategories = cache(getAllCategory);
const getCachedRents = cache(getAllRents);

export default async function Rent({ searchParams }: RentPageProps) {
  const resolvedParams = await searchParams;
  const params = extractSearchParams(resolvedParams);

  try {
    const { data: features } = await getCachedFeatures();
    const featuresRentID = features.find(
      (f: IListingFor) => f.featureName === "Rent"
    )?._id;

    if (!featuresRentID) {
      return <div>No Rent feature found.</div>;
    }

    const [{ data: rentCategories }, { data: rents, total }] =
      await Promise.all([
        getCachedCategories(featuresRentID),
        getCachedRents({ ...params }),
      ]);
    const TabsSkeleton = () => (
      <div className="animate-pulse h-12 bg-gray-200 rounded mb-4" />
    );
    const RentGridSkeleton = () => (
      <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse h-64 bg-gray-200 rounded" />
        ))}
      </div>
    );

    return (
      <div className="Container mt-8 md:my-10">
        <Suspense fallback={<TabsSkeleton />}>
          <ClientRentTabs params={resolvedParams} />
        </Suspense>
        <Suspense fallback={<RentGridSkeleton />}>
          <ClientRentView
            rents={rents}
            total={total}
            currentPage={params.page}
            rentCategories={rentCategories}
            selectedCategoryId={params.categoryId || "all"}
          />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Rent page error:", error);
    return <div className="text-red-500">Error loading rent listings.</div>;
  }
}

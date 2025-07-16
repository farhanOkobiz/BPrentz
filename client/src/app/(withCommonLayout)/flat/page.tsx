import dynamic from "next/dynamic";
import { cache } from "react";
import { getAllCategory } from "@/services/category";
import { getAllFeature } from "@/services/feature";
import { getAllFlats } from "@/services/flats";
import { IListingFor } from "@/types";
import React, { Suspense } from "react";

const RentCard = dynamic(() => import("@/components/card/RentCard/RentCard"), {
  loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded" />,
});

const FlatCategory = dynamic(
  () => import("@/components/flat/FlatCategory/FlatCategory"),
  {
    loading: () => <div className="animate-pulse h-16 bg-gray-200 rounded" />,
  }
);

const FlatPagination = dynamic(
  () => import("@/components/flat/FlatPagination"),
  {
    loading: () => <div className="animate-pulse h-12 bg-gray-200 rounded" />,
  }
);

const Tabs = dynamic(
  () => import("antd").then((mod) => ({ default: mod.Tabs })),
  {
    loading: () => <div className="animate-pulse h-12 bg-gray-200 rounded" />,
  }
);

import FlatSearchInputField from "@/components/home/search/searchContainer/FlatSearchInputField";

// Interface definitions
interface FlatSearchParams {
  location?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
}

interface FlatProps {
  searchParams: Promise<FlatSearchParams>;
}

interface OptimizedFlatParams {
  page: number;
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status: string;
}

// Cache API calls to prevent duplicate requests
const getCachedFeatures = cache(getAllFeature);
const getCachedCategories = cache(getAllCategory);
const getCachedFlats = cache(getAllFlats);

// Helper function to extract and validate search parameters
function extractSearchParams(
  resolvedParams: FlatSearchParams
): OptimizedFlatParams {
  const page = parseInt(resolvedParams.page || "1", 10);

  return {
    page,
    location: resolvedParams.location,
    category:
      resolvedParams.category !== "all" ? resolvedParams.category : undefined,
    minPrice: resolvedParams.minPrice
      ? Number(resolvedParams.minPrice)
      : undefined,
    maxPrice: resolvedParams.maxPrice
      ? Number(resolvedParams.maxPrice)
      : undefined,
    status: "published",
  };
}

// Loading skeleton components
const TabsSkeleton = () => (
  <div className="animate-pulse h-12 bg-gray-200 rounded mb-4" />
);

const CategorySkeleton = () => (
  <div className="animate-pulse h-16 bg-gray-200 rounded my-4" />
);

const FlatsGridSkeleton = () => (
  <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="animate-pulse h-64 bg-gray-200 rounded" />
    ))}
  </div>
);

const Flat: React.FC<FlatProps> = async ({ searchParams }) => {
  const resolvedParams = await searchParams;
  const params = extractSearchParams(resolvedParams);
  const pageSize = 6;

  try {
    // Step 1: Get features first (required for categories)
    const { data: features } = await getCachedFeatures();
    const featuresFlat = features.find(
      (feature: IListingFor) => feature.featureName === "Flat"
    );
    const featuresFlatID = featuresFlat?._id;

    // Step 2: Parallel API calls for categories and flats
    const [{ data: rentCategories }, { data: flats, totalContacts }] =
      await Promise.all([
        getCachedCategories(featuresFlatID),
        getCachedFlats(params),
      ]);

    // Optimize tab configuration
    const tabClass =
      "text-white bg-[#F2693C] !inline-block lg:px-4 px-2 py-1 lg:py-2 rounded lg:w-[60px] w-[50px]";
    const items = [
      {
        key: "Flat",
        label: <div className={tabClass}>Flat</div>,
        children: <FlatSearchInputField params={resolvedParams} />,
      },
    ];

    return (
      <div className="Container mt-8 md:my-10">
        {/* Critical above-fold content */}
        <Suspense fallback={<TabsSkeleton />}>
          <Tabs defaultActiveKey="Flat" type="card" items={items} />
        </Suspense>

        {/* Category section */}
        <Suspense fallback={<CategorySkeleton />}>
          <div className="my-4">
            <FlatCategory
              rentCategories={rentCategories}
              selectedCategoryId={params.category || "all"}
            />
          </div>
        </Suspense>

        {/* Flats grid and pagination */}
        <div className="mt-8">
          {flats?.length === 0 ? (
            <p className="text-center text-gray-500 lg:py-60 py-20">
              No published flats available at the moment.
            </p>
          ) : (
            <>
              <Suspense fallback={<FlatsGridSkeleton />}>
                <FlatGrid flats={flats} />
              </Suspense>

              <Suspense
                fallback={
                  <div className="animate-pulse h-12 bg-gray-200 rounded mt-10" />
                }
              >
                <div className="flex justify-center mt-10">
                  <FlatPagination
                    current={params.page}
                    total={totalContacts}
                    pageSize={pageSize}
                    hasData={flats?.length > 0}
                  />
                </div>
              </Suspense>
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading flat data:", error);
    return (
      <div className="Container mt-8 md:my-10">
        <div className="text-center text-red-500 py-20">
          <p>Failed to load flats. Please try again later.</p>
        </div>
      </div>
    );
  }
};

const FlatGrid: React.FC<{ flats: any[] }> = ({ flats }) => (
  <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4">
    {flats.map((flat: any) => (
      <RentCard key={flat._id} rent={flat} linkPrefix="flat" />
    ))}
  </div>
);

export default Flat;

import dynamic from "next/dynamic";
import { cache } from "react";
import { getAllCategory } from "@/services/category";
import { getAllFeature } from "@/services/feature";
import { getAllLands } from "@/services/land";
import { IListingFor, IRent } from "@/types";
import React, { Suspense } from "react";

// Dynamic imports to reduce initial bundle size
const RentCard = dynamic(() => import("@/components/card/RentCard/RentCard"), {
  loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded" />,
});

const LandCategory = dynamic(
  () => import("@/components/land/LandCategory/LandCategory"),
  {
    loading: () => <div className="animate-pulse h-16 bg-gray-200 rounded" />,
  }
);

const Tabs = dynamic(
  () => import("antd").then((mod) => ({ default: mod.Tabs })),
  {
    loading: () => <div className="animate-pulse h-12 bg-gray-200 rounded" />,
  }
);

import LandSearchInputField from "@/components/home/search/searchContainer/LandSearchInputField";

interface LandSearchParams {
  location?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}

interface LandProps {
  searchParams: Promise<LandSearchParams>;
}

interface OptimizedLandParams {
  location?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}

// Cache API calls to prevent duplicate requests
const getCachedFeatures = cache(getAllFeature);
const getCachedCategories = cache(getAllCategory);
const getCachedLands = cache(getAllLands);

// Helper function to extract and validate search parameters
function extractSearchParams(
  resolvedParams: LandSearchParams
): OptimizedLandParams {
  return {
    location: resolvedParams.location,
    category:
      resolvedParams.category !== "all" ? resolvedParams.category : undefined,
    minPrice: resolvedParams.minPrice
      ? Number(resolvedParams.minPrice)
      : undefined,
    maxPrice: resolvedParams.maxPrice
      ? Number(resolvedParams.maxPrice)
      : undefined,
    status: "published", // Filter on server side instead of client side
  };
}

// Loading skeleton components
const TabsSkeleton = () => (
  <div className="animate-pulse h-12 bg-gray-200 rounded mb-4" />
);

const CategorySkeleton = () => (
  <div className="animate-pulse h-16 bg-gray-200 rounded my-4" />
);

const LandsGridSkeleton = () => (
  <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="animate-pulse h-64 bg-gray-200 rounded" />
    ))}
  </div>
);

const Land: React.FC<LandProps> = async ({ searchParams }) => {
  const resolvedParams = await searchParams;
  const params = extractSearchParams(resolvedParams);

  try {
    const { data: features } = await getCachedFeatures();
    const featuresLand = features.find(
      (feature: IListingFor) => feature.featureName === "Land"
    );
    const featuresLandID = featuresLand?._id;

    const [{ data: rentCategories }, { data: lands }] = await Promise.all([
      getCachedCategories(featuresLandID),
      getCachedLands(params),
    ]);

    // Filter published lands and limit to 8 (move this logic to API for better performance)
    const publishedLands =
      lands
        ?.filter((land: IRent) => land.publishStatus === "published")
        .slice(0, 8) || [];

    // Optimize tab configuration
    const tabClass =
      "text-white bg-[#F2693C] !inline-block lg:px-4 px-2 py-1 lg:py-2 rounded lg:w-[60px] w-[50px]";
    const items = [
      {
        key: "land",
        label: <div className={tabClass}>Land</div>,
        children: <LandSearchInputField params={resolvedParams} />,
      },
    ];

    return (
      <div className="Container mt-8 md:my-10">
        <Suspense fallback={<TabsSkeleton />}>
          <Tabs defaultActiveKey="land" type="card" items={items} />
        </Suspense>

        <Suspense fallback={<CategorySkeleton />}>
          <div className="md:my-4">
            <LandCategory
              rentCategories={rentCategories}
              selectedCategoryId={params.category || "all"}
            />
          </div>
        </Suspense>

        {/* Lands grid */}
        <div className="mt-8">
          {publishedLands.length === 0 ? (
            <p className="text-center text-gray-500 lg:py-60 py-20">
              No published lands available at the moment.
            </p>
          ) : (
            <Suspense fallback={<LandsGridSkeleton />}>
              <LandGrid lands={publishedLands} />
            </Suspense>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading land data:", error);
    return (
      <div className="Container mt-8 md:my-10">
        <div className="text-center text-red-500 py-20">
          <p>Failed to load lands. Please try again later.</p>
        </div>
      </div>
    );
  }
};

// Separate component for lands grid to enable better code splitting
const LandGrid: React.FC<{ lands: IRent[] }> = ({ lands }) => (
  <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4">
    {lands.map((land: IRent) => (
      <RentCard key={land._id} rent={land} linkPrefix="land" />
    ))}
  </div>
);

export default Land;

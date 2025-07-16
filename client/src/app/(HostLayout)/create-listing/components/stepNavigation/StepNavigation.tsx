"use client";

import { usePathname, useRouter } from "next/navigation";
import { useListingStepContext } from "@/contexts/ListingStepContext";
import { useListingContext } from "@/contexts/ListingContext";
import { getStepsForFeatureType } from "../listing-utils/steps";
import { useState } from "react";

export default function StepNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { onNextSubmit } = useListingStepContext();
  const { featureType } = useListingContext();

  const stepRoutes = getStepsForFeatureType(featureType);
  const currentIndex = stepRoutes.findIndex((route) => pathname === route);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === stepRoutes.length - 1;

  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    if (!isFirst) {
      router.push(stepRoutes[currentIndex - 1]);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      if (onNextSubmit) {
        await onNextSubmit();
      }

      // if (!isLast) {
      //   router.push(stepRoutes[currentIndex + 1]);
      // }
          if (isLast) {
      router.push("/host-dashboard/listings");
    } else {
      router.push(stepRoutes[currentIndex + 1]);
    }
    } catch (err) {
      console.warn("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={handleBack}
        disabled={isFirst || loading}
        className="px-4 py-2 bg-gray-200 text-gray-800 cursor-pointer rounded disabled:opacity-50"
      >
        Back
      </button>

      <span className="text-md font-medium text-gray-900">
        Step {currentIndex + 1} / {stepRoutes.length}
      </span>

      <button
        onClick={handleNext}
        disabled={loading}
        className="px-4 md:px-6 py-2 cursor-pointer bg-primary text-white rounded disabled:opacity-50 flex items-center justify-center min-w-[100px]"
      >
        {loading ? "Loading..." : isLast ? "Finish" : "Next"}
      </button>
    </div>
  );
}

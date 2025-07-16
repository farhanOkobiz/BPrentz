"use client";

import { InputNumber, message } from "antd";
import { useEffect, useState } from "react";
import { useListingContext } from "@/contexts/ListingContext";
import { useListingStepContext } from "@/contexts/ListingStepContext";
import CategoryServices from "@/services/category/category.services";

export default function LandSizePage() {
  const { listingId, featureType } = useListingContext();
  const { setOnNextSubmit } = useListingStepContext();
  const [messageApi, contextHolder] = message.useMessage();

  const [landSize, setLandSize] = useState<number | null>(null);

  useEffect(() => {
    const fetchLandSize = async () => {
      if (!listingId || !featureType) return;
      try {
        const res: any = await CategoryServices.getListingLandSize(
          featureType,
          listingId
        );
        console.log("Fetched land size:", res);
        setLandSize(res?.data?.landSize ?? null);
      } catch (error) {
        console.error("Error fetching land size:", error);
      }
    };
    fetchLandSize();
  }, [listingId, featureType]);

  const handleSubmit = async () => {
    if (!listingId || !featureType || landSize === null) return;
    try {
      const res = await CategoryServices.updateListingLandSize(
        featureType,
        listingId,
        landSize
      );
      messageApi.success(`Land Size Updated Successfully`);
      console.log("Land size updated:", res);
    } catch (error) {
      console.error("Error updating land size:", error);
      messageApi.error(`Land Size Updated Failed`);
      throw error;
    }
  };

  useEffect(() => {
    setOnNextSubmit(handleSubmit);
  }, [landSize, listingId, featureType]);

  return (
    <div className="min-h-[calc(80vh-100px)] flex items-center justify-center">
      {contextHolder}
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-800">
            What’s the land size?
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-2">
            Please enter the land size in square feet.
          </p>
        </div>

        <div className="mt-8">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Land Size (sqft)
          </label>
          <InputNumber
            size="large"
            min={0}
            value={landSize ?? undefined}
            onChange={(value) => setLandSize(value ?? null)}
            className="!w-full rounded-xl"
            placeholder="Enter land size"
          />
        </div>
      </div>
    </div>
  );
}

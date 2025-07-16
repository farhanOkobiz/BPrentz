"use client";

import { useEffect, useState } from "react";
import { Input, message, } from "antd";
import { useListingContext } from "@/contexts/ListingContext";
import { useListingStepContext } from "@/contexts/ListingStepContext";
import CategoryServices from "@/services/category/category.services";

const { TextArea } = Input;
// const { Title, Text } = Typography;

export default function DescriptionStep() {
  const { listingId, featureType } = useListingContext();
  const { setOnNextSubmit } = useListingStepContext();
  const [description, setDescription] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchDescription = async () => {
      if (!listingId || !featureType) return;
      try {
        const res: any = await CategoryServices.getListingDescription(
          featureType,
          listingId
        );
        console.log("Fetched description:", res);
        setDescription(res?.data?.description || "");
      } catch (error) {
        console.error("Error fetching description:", error);
      }
    };
    fetchDescription();
  }, [listingId, featureType]);

  const handleSubmit = async () => {
    if (!listingId || !featureType) return;
    try {
      const res = await CategoryServices.updateListingDescription(
        featureType,
        listingId,
        description
      );
      messageApi.success(`Description Updated Successfully`);
      console.log("Description updated:", res);
    } catch (error) {
      console.error("Error updating description:", error);
      messageApi.error(`Description Update Failed`);
      throw error;
    }
  };

  useEffect(() => {
    setOnNextSubmit(handleSubmit);
  }, [description, listingId, featureType]);

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      {contextHolder}
      <div className="w-full max-w-3xl px-4 space-y-6 mx-auto">
        <h2 className="text-3xl font-bold text-primary text-center mb-2 tracking-tight">
          Add a Detailed Description
        </h2>
        <p className="text-base md:text-lg text-gray-600 text-center mb-4">
          Describe your place to attract more guests.<br className="hidden md:block" />
          <span className="text-gray-500 font-medium">
            Mention highlights, special amenities, and what makes your place unique.
          </span>
        </p>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Spacious and bright 3-bedroom apartment with a beautiful view of the lake, close to restaurants and parks..."
          rows={6}
          className="rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition"
          maxLength={500}
          showCount
        />
      </div>
    </div>
  );
}

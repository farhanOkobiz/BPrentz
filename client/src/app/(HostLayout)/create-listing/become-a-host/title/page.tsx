"use client";

import { useEffect, useState } from "react";
import { Input, message, } from "antd";
import { useListingContext } from "@/contexts/ListingContext";
import { useListingStepContext } from "@/contexts/ListingStepContext";
import CategoryServices from "@/services/category/category.services";

// const { Title, Text } = Typography;

export default function TitlePage() {
  const [title, setTitle] = useState("");
  const { listingId, featureType } = useListingContext();
  const { setOnNextSubmit } = useListingStepContext();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchTitle = async () => {
      if (!listingId || !featureType) return;
      try {
        const res: any = await CategoryServices.getListingTitle(
          featureType,
          listingId
        );

        console.log(res?.data?.title, "response title ");
        setTitle(res?.data?.title || "");
      } catch (error) {
        console.error("Error fetching title:", error);
      }
    };
    fetchTitle();
  }, [listingId, featureType]);

  const handleSubmit = async () => {
    if (!listingId || !featureType) return;
    try {
      const res = await CategoryServices.updateListingTitle(
        featureType,
        listingId,
        title
      );
      messageApi.success(`Title Updated Successfully `);
      console.log("result title ", res);
    } catch (error) {
      console.error(error);
      messageApi.error(`Title Updated Failed`);
      throw error;
    }
  };

  useEffect(() => {
    setOnNextSubmit(handleSubmit);
  }, [title, listingId, featureType]);

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      {contextHolder}
      <div className="w-full max-w-2xl space-y-6 px-4 mx-auto">
        <h2 className="text-3xl font-bold text-primary text-center mb-2 tracking-tight">
          Create a Catchy Title for Your Listing
        </h2>
        <p className="text-base md:text-lg text-gray-600 text-center mb-4">
          Make your place stand out with a short, memorable title.<br className="hidden md:block" />
          <span className="text-gray-500 font-medium">
            Example: <span className="italic">Cozy 2-bedroom apartment near Gulshan</span>
          </span>
        </p>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Cozy 2-bedroom apartment near Gulshan"
          size="large"
          className="rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary transition"
          maxLength={80}
          showCount
        />
      </div>
    </div>
  );
}

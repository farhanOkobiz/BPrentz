"use client";

import { useState, useEffect } from "react";
import { useListingContext } from "@/contexts/ListingContext";
import { useListingStepContext } from "@/contexts/ListingStepContext";
import CategoryServices from "@/services/category/category.services";
import { message } from "antd";

export default function FloorPlanStep() {
  const { listingId, featureType } = useListingContext();
  const { setOnNextSubmit } = useListingStepContext();
  const [messageApi, contextHolder] = message.useMessage();
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [beds, setBeds] = useState(0);
  const [adults, setAdults] = useState(0);
  // const [children, setChildren] = useState(0);
  // const [infants, setInfants] = useState(0);

  // const totalGuests = adults + children + infants;
  const totalGuests = adults;

  const handleSubmit = async () => {
    if (!listingId || !featureType) return;

    const floorPlan = {
      bedroomCount: bedrooms,
      bathCount: bathrooms,
      bedCount: beds,
      guestCount: totalGuests,
    };

    try {
      const res = await CategoryServices.processUpdateFloorPlan(
        featureType,
        listingId,
        floorPlan
      );
      messageApi.success(`${featureType} Updated Successfully`);
      console.log("Submitted floor plan:", res);
    } catch (error) {
      console.error("Failed to submit floor plan:", error);
      messageApi.error("Updated Failed");
      throw error;
    }
  };

  useEffect(() => {
    setOnNextSubmit(handleSubmit);
  }, [bedrooms, bathrooms, beds, adults]);

  const renderCounter = (
    label: string,
    value: number,
    onChange: (val: number) => void
  ) => (
    <div className=" flex items-center justify-between px-2">
      <div>
        <span className="font-semibold text-lg text-gray-700">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => value > 0 && onChange(value - 1)}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-2xl text-primary hover:bg-primary hover:text-white transition disabled:opacity-50"
          disabled={value === 0}
          aria-label={`Decrease ${label}`}
        >
          –
        </button>
        <span className="text-xl font-bold w-8 text-center">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-2xl text-primary hover:bg-primary hover:text-white transition"
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white rounded-xl shadow-lg py-8 px-6 max-w-4xl space-y-8 mx-auto">
      {contextHolder}
      <h2 className="text-3xl font-bold mb-2 text-center text-primary tracking-tight">
        Share some basics about your property
      </h2>
      <p className="text-lg text-gray-600 font-medium mb-8 text-center">
        Add the essentials for your guests. <br className="hidden md:block" />
        <span className="text-gray-500 font-normal">
          You’ll add more details later.
        </span>
      </p>
      <div className="flex flex-col gap-8">
        {renderCounter("Bedrooms", bedrooms, setBedrooms)}
        {renderCounter("Bathrooms", bathrooms, setBathrooms)}
        {renderCounter("Beds", beds, setBeds)}
        {renderCounter("Guests", adults, setAdults)}
      </div>
    </div>
  );

}

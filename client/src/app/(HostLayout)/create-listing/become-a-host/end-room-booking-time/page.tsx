"use client";

import { useEffect, useState } from "react";
import { Typography, DatePicker, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useListingContext } from "@/contexts/ListingContext";
import { useListingStepContext } from "@/contexts/ListingStepContext";
import CategoryServices from "@/services/category/category.services";

const { Title, Text } = Typography;

export default function CheckoutDatePage() {
  const [checkoutDate, setCheckoutDate] = useState<Dayjs | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { listingId, featureType } = useListingContext();
  const { setOnNextSubmit } = useListingStepContext();

  const handleSubmit = async () => {
    if (!listingId || !featureType || !checkoutDate) {
      messageApi.warning("Please select a checkout date.");
      return;
    }

    try {
      await CategoryServices.updateListingCheckOutRoom(
        featureType,
        listingId,
        checkoutDate.toDate()
      );
      messageApi.success("Checkout date saved successfully.");
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to save checkout date.");
    }
  };

  useEffect(() => {
    setOnNextSubmit(handleSubmit);
  }, [checkoutDate, listingId, featureType]);

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      {contextHolder}
      <div className="w-full max-w-2xl space-y-6 px-4">
        <Title level={3}>Available Till</Title>
        <Text type="secondary">
          When will guests no longer be able to book this listing?
        </Text>

        <DatePicker
          className="w-full"
          size="large"
          placeholder="Select checkout date"
          value={checkoutDate}
          onChange={(date) => setCheckoutDate(date)}
          disabledDate={(current) =>
            current && current < dayjs().startOf("day")
          }
        />
      </div>
    </div>
  );
}

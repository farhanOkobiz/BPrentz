"use client";

import { useEffect, useState } from "react";
import { Typography, DatePicker, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useListingContext } from "@/contexts/ListingContext";
import { useListingStepContext } from "@/contexts/ListingStepContext";
import CategoryServices from "@/services/category/category.services";

const { Title, Text } = Typography;

export default function CheckinDatePage() {
  const [checkinDate, setCheckinDate] = useState<Dayjs | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const { listingId, featureType } = useListingContext();
  const { setOnNextSubmit } = useListingStepContext();

  const handleSubmit = async () => {
    if (!listingId || !featureType || !checkinDate) {
      messageApi.warning("Please select a check-in date.");
      return;
    }

    try {
      await CategoryServices.updateListingCheckingRoom(
        featureType,
        listingId,
        checkinDate.toDate()
      );
      messageApi.success("Check-in date saved successfully.");
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to save check-in date.");
    }
  };

  useEffect(() => {
    setOnNextSubmit(handleSubmit);
  }, [checkinDate, listingId, featureType]);

  return (
    <div className="min-h-[calc(100vh-150px)] flex items-center justify-center">
      {contextHolder}
      <div className="w-full max-w-2xl space-y-6 px-4">
        <Title level={3}>Available From</Title>
        <Text type="secondary">
          When do you want guests to start booking this listing?
        </Text>

        <DatePicker
          className="w-full"
          size="large"
          placeholder="Select check-in date"
          value={checkinDate}
          onChange={(date) => setCheckinDate(date)}
          disabledDate={(current) =>
            current && current < dayjs().startOf("day")
          }
        />
      </div>
    </div>
  );
}

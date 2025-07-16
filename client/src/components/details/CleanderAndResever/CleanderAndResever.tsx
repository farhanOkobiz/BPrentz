"use client";

import React, { useEffect, useState } from "react";
import { useDateRange } from "@/contexts/DateRangeContext";
import Cleander from "../Cleander/Cleander";
import { getBlockedDates, getRentBookingsByRentId } from "@/services/rents";
import dayjs from "dayjs";

interface Props {
  title: string;
  rentId: string;
  rentStartDate?: Date;
  rentEndDate?: Date;
}


const CleanderAndResever: React.FC<Props> = ({ title, rentId, rentStartDate, rentEndDate }) => {
  const { dateRange, setDateRange } = useDateRange();
  const { startDate, endDate } = dateRange;
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  // Add state to track first click
  const [hasFirstClick, setHasFirstClick] = useState(false);

  const [nextBlockedDate, setNextBlockedDate] = useState<Date | null>(null);

  const numberOfNights =
    startDate && endDate
      ? (() => {
        const start = dayjs(startDate).startOf("day");
        const end = dayjs(endDate).startOf("day");
        let count = 0;

        for (let d = start.clone(); d.isBefore(end); d = d.add(1, "day")) {
          const formatted = d.format("YYYY-MM-DD");
          if (!blockedDates.includes(formatted)) {
            count++;
          }
        }

        return count;
      })()
      : 0;

  useEffect(() => {
    const fetchBlocked = async () => {
      try {
        const res = await getBlockedDates(rentId);
        console.log("Blocked dates response:", res);
        const bookingDate = await getRentBookingsByRentId(rentId);
        console.log("Booking dates response:", bookingDate);
                    const bookingDateArray: string[] = [];
        bookingDate.data.forEach((booking: any) => {
          const start = dayjs(booking.checkinDate);
          const end = dayjs(booking.checkoutDate).add(1, "day");

          for (let d = start; d.isBefore(end); d = d.add(1, "day")) {
            bookingDateArray.push(d.format("YYYY-MM-DD"));
          }

        });
        const manualBlockedDates = (res?.data || []).map((d: any) =>
          dayjs(d.blockDate).format("YYYY-MM-DD")
        );
        console.log("manualBlockedDates", manualBlockedDates);
        console.log("bookingDateArray", bookingDateArray);
          const allBlockedDates = Array.from(new Set([...bookingDateArray, ...manualBlockedDates]));

  setBlockedDates(allBlockedDates);
      } catch (err) {
        console.error("Failed to fetch blocked dates", err);
      }
    };

    fetchBlocked();
  }, [rentId]);


  return (
    <div className="md:mt-20 mt-2 flex flex-wrap">
      <div className=" w-full">
        <Cleander
          dateRange={dateRange}
          setDateRange={setDateRange}
          title={title}
          numberOfNights={numberOfNights}
          blockedDates={blockedDates}
          setHasFirstClick={setHasFirstClick}
          hasFirstClick={hasFirstClick} // Pass the state to Cleander component
          setBlockedDates={setBlockedDates}
          nextBlockedDate={nextBlockedDate}
          setNextBlockedDate={setNextBlockedDate}
          rentEndDate={rentEndDate}
          rentStartDate={rentStartDate}
        />
      </div>
      <div className="lg:w-1/3 w-full">
        <div className="sticky top-0">{/* Future: Reserve component */}</div>
      </div>
    </div>
  );
};

export default CleanderAndResever;

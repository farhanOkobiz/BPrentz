"use client";
import { poppins } from "@/app/font";
import DatesModel from "@/components/modals/DatesModel";
import { useDateRange } from "@/contexts/DateRangeContext";
import { getBlockedDates } from "@/services/rents";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";

interface DateProps {
  rentId: string;
} 

const Dates = ({ rentId }: DateProps) => {
  const [openModal, setOpenModal] = useState(false);
  const { dateRange } = useDateRange();
  const { startDate, endDate } = dateRange;
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  useEffect(() => {
    const fetchBlocked = async () => {
      try {
        const res = await getBlockedDates(rentId);
        const dates = (res?.data || []).map((d: any) => new Date(d.blockDate));
        setBlockedDates(dates);
      } catch (err) {
        console.error("Failed to fetch blocked dates", err);
      }
    };
    if (openModal) {
      fetchBlocked();
    }
  }, [openModal, rentId]);
  console.log("blockedDates ==", blockedDates);
  return (
    <div>
      <div
        className={`flex justify-between border-b pb-6 border-[#262626]/30 ${poppins.className}`}
      >
        <div>
          <h2 className="font-medium">Dates</h2>
          <p>
            {startDate ? format(startDate, "MMM d, yyyy") : "No start date"} -{" "}
            {endDate ? format(endDate, "MMM d, yyyy") : "No end date"}
          </p>
        </div>
        <div>       
        </div>
      </div>

      {openModal && (
        <DatesModel
          onClose={() => setOpenModal(false)}
          blockedDates={blockedDates}
        />
      )}
    </div>
  );
};

export default Dates;


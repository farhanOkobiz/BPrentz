"use client";
import React from "react";
import Image from "next/image";
import { poppins } from "@/app/font";
import { HiMiniXMark } from "react-icons/hi2";
import { IRent } from "@/types";
import { useDateRange } from "@/contexts/DateRangeContext";
import { apiBaseUrl } from "@/config/config";
interface Props {
  data: IRent;
}
const CheckOutRentCard: React.FC<Props> = ({ data }) => {
  const { dateRange } = useDateRange();
  const { startDate, endDate } = dateRange;
  const numberOfNights =
    startDate && endDate
      ? (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      : 1;
  const roomPrice = data.price;
  const subTotal = roomPrice * numberOfNights;
  return (
    <div
      className={`sticky top-30 border border-[#262626]/20 shadow rounded px-4 py-4 flex flex-col gap-4 ${poppins.className}`}
    >
      <div className="flex gap-2 border-b border-[#262626]/12 pb-5">
        <div className="w-[100px] h-[100px] rounded">
          <Image
            src={apiBaseUrl + data.coverImage}
            alt="rentImage"
            width={100}
            height={100}
            className="w-full h-full rounded"
          />
        </div>
        <div className="w-[70%] line-clamp-4">
          <p className="font-medium capitalize md:text-base text-sm">
            {data.title}
          </p>
        </div>
      </div>

      <div className="border-b border-[#262626]/12 pb-5">
        <h2 className="text-xl font-medium">Price details</h2>

        <div className="flex items-center justify-between mt-3">
          <p className="flex items-center">
            <span>৳{data.price}</span>
            <span>
              <HiMiniXMark />
            </span>
            <span>{numberOfNights} nights</span>
          </p>

          <p>৳{subTotal}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="">Gateway fee</p>
          <p>৳00.00</p>
        </div>
      </div>

      <div className="flex items-center justify-between font-semibold">
        <p className="">Total amount</p>
        <p>৳{subTotal}</p>
      </div>
    </div>
  );
};

export default CheckOutRentCard;

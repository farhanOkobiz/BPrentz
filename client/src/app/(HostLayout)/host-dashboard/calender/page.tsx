"use client";

import React, { useEffect, useState } from "react";
import { Select, Skeleton, message } from "antd";
import dayjs from "dayjs";
import {
  getAllHostRents,
  getBlockedDates,
  getSingleRentBySlug,
  getRentBookingsCalenderDateBlocked,
} from "@/services/rents";
import CalendarGrid from "../../components/CalendarGrid";
import { useRouter } from "next/navigation";

interface RentData {
  _id: string;
  title: string;
  slug: string;
  rentId?: string;
  checkinDate: string | null;
  checkoutDate: string | null;
}

export default function CalendarView() {
  const [rentList, setRentList] = useState<RentData[]>([]);
  const [selectedRent, setSelectedRent] = useState<RentData | null>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const rentTitleLimit = 1000;
  const page = 1;

  useEffect(() => {
    const fetchRents = async () => {
      const token = localStorage.getItem("accessToken") || "";
      try {
        const res = await getAllHostRents(token, page, rentTitleLimit);
        setRentList(res.data || []);
      } catch {
        message.error("Failed to load your rent listings");
      }
    };
    fetchRents();
  }, []);

  const handleSelect = async (id: string) => {
    const rent = rentList.find((r) => r._id === id);
    if (!rent) return;
    setLoading(true);
    try {
      const rentDetailRes = await getSingleRentBySlug(rent.slug);
      const rentData = rentDetailRes.data;
      setSelectedRent(rentData);

      if (rentData.checkinDate && rentData.checkoutDate) {
      }

      const token = localStorage.getItem("accessToken") || "";

      // Fetch manually blocked dates
      const blockRes = await getBlockedDates(rent._id);
      const manuallyBlocked = (blockRes.data || []).map(
        (item: { blockDate: string }) =>
          dayjs(item.blockDate).format("YYYY-MM-DD")
      );

      // Fetch bookings
      const bookingRes = await getRentBookingsCalenderDateBlocked(
        rent._id,
        token
      );
      const bookingBlocked: string[] = [];

      (bookingRes?.data || []).forEach(
        (booking: { checkinDate: string; checkoutDate: string }) => {
          const start = dayjs(booking.checkinDate);
          const end = dayjs(booking.checkoutDate);
          for (let d = start; d.isBefore(end, "day"); d = d.add(1, "day")) {
            bookingBlocked.push(d.format("YYYY-MM-DD"));
          }
        }
      );

      // Combine both blocked sources
      const allBlockedDates = Array.from(
        new Set([...manuallyBlocked, ...bookingBlocked])
      );
      setBlockedDates(allBlockedDates);
    } catch {
      message.error("Failed to fetch calendar data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Container mt-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl tracking-wider font-semibold mb-2 sm:mb-0">
          Select a Rent Listing to Manage Calendar
        </h2>
        <Select
          style={{ width: "100%", maxWidth: 400 }}
          placeholder="Choose a listing"
          onChange={handleSelect}
          loading={rentList.length === 0}
          className="sm:ml-auto"
        >
          {rentList.map((rent) => (
            <Select.Option key={rent._id} value={rent._id}>
              {rent.title ? rent.title : "Untitled Rent"}
            </Select.Option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton.Input active style={{ width: "100%", height: 300 }} />
          <Skeleton.Input active style={{ width: "100%", height: 300 }} />
        </div>
      ) : selectedRent ? (
        selectedRent.checkinDate && selectedRent.checkoutDate ? (
          <div className="mt-8">
            <CalendarGrid
              checkinDate={dayjs(selectedRent.checkinDate)}
              checkoutDate={dayjs(selectedRent.checkoutDate)}
              blockedDates={blockedDates}
              rentId={selectedRent._id}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center mt-8 lg:mt-20">
            <p className="text-primary text-md lg:text-xl mb-4">
              Please set Check-in and Check-out dates for this listing to manage
              its calendar.
            </p>
            <button
              className="px-4 py-2 bg-primary text-white rounded cursor-pointer"
              onClick={() => router.push("/host-dashboard/listings")}
            >
              Set Available Dates
            </button>
          </div>
        )
      ) : null}
    </div>
  );
}

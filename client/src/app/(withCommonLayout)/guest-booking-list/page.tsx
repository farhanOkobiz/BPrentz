"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IBooking } from "@/types";
import { getGuestRents } from "@/services/rents";
import BookingList from "@/components/bookingList/BookingList";
import { Skeleton } from "antd";

const PAGE_SIZE = 10;

const RentPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const [rents, setRents] = useState<IBooking[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchRents = async (page: number) => {
    setLoading(true);
    const token = localStorage.getItem("accessToken") || "";
    try {
      const res = await getGuestRents(token, page, PAGE_SIZE);
      setRents(res.data);
      setTotal(res.totalContacts);
    } catch (error) {
      console.error("Failed to fetch rents", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRents(currentPage);
  }, [currentPage]);

  const handlePageChange = async (page: number | string): Promise<void> => {
    const pageNumber = typeof page === "string" ? parseInt(page, 10) : page;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="Container mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings </h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <Skeleton key={idx} active paragraph={{ rows: 3 }} style={{ minHeight: 180, padding: 24 }} className="rounded-lg" />
          ))}
        </div>
      ) : (
        <BookingList
          rents={rents}
          total={total}
          currentPage={currentPage}
          refetchRents={handlePageChange}
        />
      )}
    </div>
  );
};

export default RentPage;

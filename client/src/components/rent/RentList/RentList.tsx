"use client";

import React from "react";
import { Pagination } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { IRent } from "@/types";
import RentCard from "@/components/card/RentCard/RentCard";

interface RentListProps {
  rents: IRent[];
  total: number;
  currentPage: number;
}

const RentList: React.FC<RentListProps> = ({ rents, total, currentPage }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageSize = 8;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", page.toString());
    router.push(`/rent?${params.toString()}`);
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rents.map((rent) => (
          <RentCard key={rent._id} rent={rent} linkPrefix="rent" />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default RentList;

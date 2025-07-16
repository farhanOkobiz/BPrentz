"use client";
import { poppins } from "@/app/font";
import ReserveModel from "@/components/modals/ReserveModel";
import { TFloorPlan } from "@/types";
import React, { useState } from "react";

interface Props {
  slug: string;
  price: number;
  floorPlan: TFloorPlan;
}
const ReservFooterBtn: React.FC<Props> = ({ slug, price, floorPlan }) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div>
      <div
        onClick={() => setOpenModal(true)}
        className="bottom-0 right-0 fixed flex justify-center items-center text-center w-full py-1 bg-primary rounded-t lg:hidden cursor-pointer"
      >
        <h2
          className={`text-[#fff] uppercase tracking-wider font-medium ${poppins.className}`}
        >
          Reserve
        </h2>
      </div>

      {openModal && (
        <ReserveModel
          slug={slug}
          price={price}
          floorPlan={floorPlan}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default ReservFooterBtn;

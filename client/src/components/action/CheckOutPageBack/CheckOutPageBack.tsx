"use client";
import { poppins } from "@/app/font";

import { useRouter } from "next/navigation";
import React from "react";
import { MdArrowBackIosNew } from "react-icons/md";

const CheckOutPageBack = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.back()}
      className={`flex items-center gap-2 text-xl cursor-pointer hover:text-primary duration-300 ${poppins.className}`}
    >
      <p>
        <MdArrowBackIosNew className="md:text-base text-sm" />
      </p>
      <h1 className="lg:text-3xl md:text-2xl text-xl font-medium">
        Confirm and pay
      </h1>
    </div>
  );
};

export default CheckOutPageBack;

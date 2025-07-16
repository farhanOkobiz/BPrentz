"use client";
import React, { useState } from "react";
import { createBooking } from "@/services/rents";
import { useDateRange } from "@/contexts/DateRangeContext";
import { message } from "antd";
// import { useRouter } from "next/navigation";
import dayjs from "dayjs";
interface RentConfirmBtnProps {
  rentId: string;
}

const RentConfirmBtn: React.FC<RentConfirmBtnProps> = ({ rentId }) => {
  // const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { dateRange, guestInfo } = useDateRange();
  const { startDate, endDate } = dateRange;
  const totalGuest = guestInfo?.guests;
  const [messageApi, contextHolder] = message.useMessage();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreed(e.target.checked);
  };
  const handleConfirmAndPay = async () => {
    if (!startDate || !endDate || !rentId) return;
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("accessToken") || "";
      const res = await createBooking({
        rent: rentId,
        checkinDate: dayjs(startDate).format("YYYY-MM-DD"),
        checkoutDate: dayjs(endDate).format("YYYY-MM-DD"),
        guestCount: totalGuest,
        accessToken,
      });

      console.log("Booking response:", res);

      if (res?.redirectUrl) {
        messageApi.success("Redirecting to payment...");
        window.location.href = res.redirectUrl;
      } else {
        messageApi.error("Failed to initiate payment. No redirect URL.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      messageApi.error("Booking failed!");
    } finally {
      setLoading(false);
    }
  };

  // const handleConfirmAndPay = async () => {
  //   if (!startDate || !endDate || !rentId) return;
  //   setLoading(true);
  //   try {
  //     const accessToken = localStorage.getItem("accessToken") || "";
  //     const res = await createBooking({
  //       rent: rentId,
  //       checkinDate: dayjs(startDate).format("YYYY-MM-DD"),
  //       checkoutDate: dayjs(endDate).format("YYYY-MM-DD"),
  //       guestCount: totalGuest,
  //       accessToken,
  //     });
  //     console.log("Booking response:", res);
  //     messageApi.success("Booking successful!");
  //     setTimeout(() => {
  //       router.push("/");
  //     }, 1000);
  //   } catch (error) {
  //     console.error("Booking error:", error);
  //     messageApi.error("Booking failed!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div>
      {contextHolder}
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          onChange={handleCheckboxChange}
          id="terms"
          className="mt-1"
        />
        <label htmlFor="terms" className="text-sm">
          By selecting the button below, I agree to the{" "}
          <span className="underline font-semibold hover:text-primary duration-300 cursor-pointer">
            Terms & Conditions
          </span>{" "}
          and{" "}
          <span className="underline font-semibold hover:text-primary duration-300 cursor-pointer">
            Refund Policy
          </span>
          .
        </label>
      </div>

      <div
        className={`mt-4 px-6 py-3 font-semibold tracking-wide rounded inline-flex ${agreed
          ? "bg-primary cursor-pointer"
          : "bg-[#D1D5DB] cursor-not-allowed"
          }`}
      >
        <button
          disabled={!agreed || loading}
          className="text-white cursor-pointer"
          onClick={handleConfirmAndPay}
        >
          {loading ? "Processing..." : "Confirm and Pay"}
        </button>
      </div>
    </div>
  );
};

export default RentConfirmBtn;

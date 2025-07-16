"use client";
import { monthsList, yearList } from "@/utilits/months";
import React, { useState } from "react";

import { getHostRentEarnings } from "@/services/rents";
import EarningsRentList from "../listingsPage/EarningsRentList";

const EarningPage = () => {
  const [fromMonth, setFromMonth] = useState("");
  const [fromYear, setFromYear] = useState("");
  const [toMonth, setToMonth] = useState("");
  const [toYear, setToYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [earnings, setEarnings] = useState<any>(null);

  const accessToken =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await getHostRentEarnings({
        formMonth: fromMonth,
        toMonth: toMonth,
        formYear: fromYear,
        toYear: toYear,
        accessToken: accessToken || "",
      });
      setEarnings(data);
    } catch {
      setEarnings(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFromMonth("");
    setFromYear("");
    setToMonth("");
    setToYear("");
    setEarnings(null);
  };

  return (
    <div className="mt-8">
      <div className="flex lg:flex-nowrap flex-wrap items-center justify-center gap-2">
        {/* From Month */}
        <div className="w-full flex gap-2 border border-[#262626]/30 rounded px-2 py-3">
          <label htmlFor="fromMonth" className="font-medium">
            From:
          </label>
          <select
            id="fromMonth"
            className="w-full outline-none bg-[#fff] text-sm"
            value={fromMonth}
            onChange={(e) => setFromMonth(e.target.value)}
          >
            <option value="">Select a Month</option>
            {monthsList?.map((month) => (
              <option key={month.id} value={month.id}>
                {month.month}
              </option>
            ))}
          </select>
        </div>
        {/* From Year */}
        <div className="w-full flex gap-2 border border-[#262626]/30 rounded px-2 py-3">
          <label htmlFor="fromYear" className="font-medium">
            Year:
          </label>
          <select
            id="fromYear"
            className="w-full outline-none bg-[#fff] text-sm"
            value={fromYear}
            onChange={(e) => setFromYear(e.target.value)}
          >
            <option value="">Select a Year</option>
            {yearList.map((year) => (
              <option key={year.id} value={year.year}>
                {year.year}
              </option>
            ))}
          </select>
        </div>
        {/* To Month */}
        <div className="w-full flex gap-2 border border-[#262626]/30 rounded px-2 py-3">
          <label htmlFor="toMonth" className="font-medium">
            To:
          </label>
          <select
            id="toMonth"
            className="w-full outline-none bg-[#fff] text-sm"
            value={toMonth}
            onChange={(e) => setToMonth(e.target.value)}
          >
            <option value="">Select a Month</option>
            {monthsList?.map((month) => (
              <option key={month.id} value={month.id}>
                {month.month}
              </option>
            ))}
          </select>
        </div>
        {/* To Year */}
        <div className="w-full flex gap-2 border border-[#262626]/30 rounded px-2 py-3">
          <label htmlFor="toYear" className="font-medium">
            Year:
          </label>
          <select
            id="toYear"
            className="w-full outline-none bg-[#fff] text-sm"
            value={toYear}
            onChange={(e) => setToYear(e.target.value)}
          >
            <option value="">Select a Year</option>
            {yearList.map((year) => (
              <option key={year.id} value={year.year}>
                {year.year}
              </option>
            ))}
          </select>
        </div>
        {/* Search and Clear Buttons */}
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={handleSearch}
          disabled={loading}
        >
          Search
        </button>
        <button
          className="bg-gray-400 text-white px-4 py-2 rounded"
          onClick={handleClear}
          disabled={loading}
        >
          Clear
        </button>
      </div>

      <div className="bg-[#F7F7F7] flex flex-col gap-2 items-center justify-center rounded py-12 mt-12">
        <p className="text-2xl">Earnings Summary</p>
        <p className="text-sm mt-2">
          {loading
            ? "Loading earnings..."
            : earnings && earnings.data
            ? `Your earnings: ${earnings.data.totalEarnings ?? 0}`
            : "You have no earnings."}
        </p>
      </div>

      {/* EarningsRentList Table */}
      {earnings && earnings.data && (
        <EarningsRentList
          bookings={earnings.data.bookings}
          totalEarnings={earnings.data.totalEarnings}
        />
      )}
    </div>
  );
};

export default EarningPage;

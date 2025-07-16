"use client";

import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { message } from "antd";
import { postToggleBlockDate } from "@/services/rents";

dayjs.extend(isBetween);

interface Props {
  checkinDate: Dayjs;
  checkoutDate: Dayjs;
  blockedDates: string[];
  rentId: string;
}

const CalendarGrid = ({
  checkinDate,
  checkoutDate,
  blockedDates,
  rentId,
}: Props) => {
  const [blockedSet, setBlockedSet] = useState(
    new Set(blockedDates.map((d) => dayjs(d).format("YYYY-MM-DD")))
  );
  const [messageApi, contextHolder] = message.useMessage();

  const startOfRange = checkinDate.startOf("month").startOf("week");
  const endOfRange = checkoutDate.endOf("month").endOf("week");

  const calendarDays: Dayjs[] = [];
  let current = startOfRange.clone();
  while (
    current.isBefore(endOfRange, "day") ||
    current.isSame(endOfRange, "day")
  ) {
    calendarDays.push(current.clone());
    current = current.add(1, "day");
  }

  const monthMap: Record<string, Dayjs[]> = {};
  calendarDays.forEach((day) => {
    const key = day.format("YYYY-MM");
    if (!monthMap[key]) {
      monthMap[key] = [];
    }
    monthMap[key].push(day);
  });

  const handleDateClick = async (date: Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    const token = localStorage.getItem("accessToken") || "";
    try {
      const res = await postToggleBlockDate({
        rentId,
        date: dateStr,
        accessToken: token,
      });
      if (res?.status === "success") {
        messageApi.success(
          res?.data?.message ? res?.data?.message : "Date Blocked Successfully"
        );
      }

      const updated = new Set(blockedSet);
      if (blockedSet.has(dateStr)) {
        updated.delete(dateStr);
      } else {
        updated.add(dateStr);
      }
      setBlockedSet(updated);
    } catch {
      message.error("Failed to toggle date block status.");
    }
  };

  const today = dayjs().startOf("day");

  return (
    <>
      {contextHolder}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Calendar Color Guide
        </h3>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded-sm" />
            Available Date
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-red-300 rounded-sm line-through" />
            Blocked Date
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {Object.entries(monthMap)
          .filter(([, days]) =>
            days.some((day) =>
              day.isBetween(checkinDate, checkoutDate, "day", "[]")
            )
          )
          .map(([monthKey, days]) => {
            const monthLabel = dayjs(monthKey).format("MMMM YYYY");

            return (
              <div key={monthKey}>
                <h2 className="text-xl font-bold text-gray-700 mb-2 text-center">
                  {monthLabel}
                </h2>

                <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 mb-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (d) => (
                      <div key={d}>{d}</div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-2 text-sm">
                  {days.map((day, idx) => {
                    const dateStr = day.format("YYYY-MM-DD");
                    const isInRange = day.isBetween(
                      checkinDate,
                      checkoutDate,
                      "day",
                      "[]"
                    );
                    const isBlocked = blockedSet.has(dateStr);
                    const isSameMonth = day.isSame(dayjs(monthKey), "month");
                    const isPast = day.isBefore(today, "day");

                    if (!isInRange) return <div key={idx}></div>;

                    let className =
                      "h-12 flex items-center justify-center rounded border select-none transition ";

                    if (!isSameMonth) {
                      className += "bg-gray-100 text-gray-400";
                    } else if (isPast) {
                      className +=
                        "bg-gray-200 text-gray-400 cursor-not-allowed";
                    } else if (isBlocked) {
                      className +=
                        "bg-red-200 text-red-700 line-through cursor-pointer hover:bg-red-300";
                    } else {
                      className +=
                        "bg-green-100 text-black cursor-pointer hover:bg-green-200";
                    }

                    const isClickable = isSameMonth && !isPast;

                    return (
                      <div
                        key={idx}
                        className={className}
                        onClick={() =>
                          isClickable ? handleDateClick(day) : undefined
                        }
                      >
                        {day.date()}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {Object.entries(monthMap).map(([monthKey, days]) => {
          const monthLabel = dayjs(monthKey).format("MMMM YYYY");

          return (
            <div key={monthKey}>
              <h2 className="text-xl font-bold text-gray-700 mb-2 text-center">
                {monthLabel}
              </h2>

              <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 mb-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 text-sm">
                {days.map((day, idx) => {
                  const dateStr = day.format("YYYY-MM-DD");
                  const isInRange = day.isBetween(
                    checkinDate,
                    checkoutDate,
                    "day",
                    "[]"
                  );
                  const isBlocked = blockedSet.has(dateStr);
                  const isSameMonth = day.isSame(dayjs(monthKey), "month");
                  const isPast = day.isBefore(today, "day");
                  if (!isInRange) return <div key={idx}></div>;

                  let className =
                    "h-12 flex items-center justify-center rounded border select-none transition ";

                  if (!isSameMonth) {
                    className += "bg-gray-100 text-gray-400";
                  } else if (isPast) {
                    className += "bg-gray-200 text-gray-400 cursor-not-allowed";
                  } else if (isBlocked) {
                    className +=
                      "bg-red-200 text-red-700 line-through cursor-pointer hover:bg-red-300";
                  } else {
                    className +=
                      "bg-green-100 text-black cursor-pointer hover:bg-green-200";
                  }

                  const isClickable = isSameMonth && !isPast;

                  return (
                    <div
                      key={idx}
                      className={className}
                      onClick={() =>
                        isClickable ? handleDateClick(day) : undefined
                      }
                    >
                      {day.date()}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div> */}
    </>
  );
};

export default CalendarGrid;

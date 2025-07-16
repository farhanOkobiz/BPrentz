"use client";

import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import dayjs from "dayjs";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface CleanderProps {
  dateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  setDateRange: (range: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => void;
  title: string;
  numberOfNights: number;
  blockedDates: string[];
  setHasFirstClick?: ((value: boolean) => void);
  hasFirstClick?: boolean; 
  setBlockedDates?: (dates: string[]) => void; 
  nextBlockedDate?: Date | null; 
  setNextBlockedDate?: (date: Date | null) => void; 
  rentEndDate?: Date; 
  rentStartDate?: Date; 
}

const Cleander: React.FC<CleanderProps> = ({
  dateRange,
  setDateRange,
  title,
  numberOfNights,
  blockedDates,
  setHasFirstClick,
  hasFirstClick,
  setBlockedDates,
  nextBlockedDate,
  setNextBlockedDate,
  rentEndDate,
  rentStartDate,
}) => {
  // nextBlockedDate useState 
const [monthsToShow, setMonthsToShow] = useState(2);
  const disableDate = (date: Date) => {
    const today = dayjs().startOf("day");
    const target = dayjs(date).startOf("day");
    // console.log("target--------------------------------", target);
    // console.log("today--------------------------------", today);


    // // Before first click, only disable past dates
    // if (!hasFirstClick) {
    //   return target.isBefore(today);
    // }

    // After first click, apply basic disable logic
    if (target.isBefore(today)) {
      return true;
    }

    // If no start date selected, only disable blocked dates
    if (!dateRange.startDate) {
      return blockedDates.includes(target.format("YYYY-MM-DD"));
    }


    const startDate = dayjs(dateRange.startDate).startOf("day");

    // Disable dates before selected start date
if (dateRange.startDate && dateRange.endDate &&
  !dayjs(dateRange.startDate).isSame(dateRange.endDate, 'day')) { 
    if(hasFirstClick) {
      if (typeof setHasFirstClick === "function") {
        setHasFirstClick(false);
      }

          const nextBlockedDate = blockedDates
        .map((d) => dayjs(d))
        .filter((d) => d.isAfter(startDate))
        .sort((a, b) => a.valueOf() - b.valueOf())[0];
                const nextBlockedDateStr = dayjs(nextBlockedDate).format('YYYY-MM-DD');
        if (typeof setNextBlockedDate === "function") {
          setNextBlockedDate(nextBlockedDate ? nextBlockedDate.toDate() : null);
        }

        // Only remove the exact nextBlockedDate
        const updatedBlockedDates = blockedDates.filter(date => date !== nextBlockedDateStr);

        console.log("--------------------------------updatedBlockedDates ", updatedBlockedDates);
        setBlockedDates?.(updatedBlockedDates);
    }
  }
else if (target.isBefore(startDate)) {
  if (typeof setHasFirstClick === "function") {
    setHasFirstClick(true);
  }
  // nextBlockedDate push abar blockedDates e add koro 
  if (typeof setNextBlockedDate === "function") {
    setNextBlockedDate(null);
  }
  //  add the next blocked date to the blocked dates
  if (setBlockedDates) {
    const nextBlockedDateStr = dayjs(nextBlockedDate).format('YYYY-MM-DD');
    if (!blockedDates.includes(nextBlockedDateStr)) {
      setBlockedDates([...blockedDates, nextBlockedDateStr]);
    }
  }

  return true;
}

    if (hasFirstClick) {
      // If both dates are selected and they're different, reset to initial state
      if (dateRange.startDate && dateRange.endDate &&
        !dayjs(dateRange.startDate).isSame(dateRange.endDate, 'day')) {
        // if (typeof setHasFirstClick === "function") {
        //   setHasFirstClick(false);
        // }
        return blockedDates.includes(target.format("YYYY-MM-DD"));
      }

      const nextBlockedDate = blockedDates
        .map((d) => dayjs(d))
        .filter((d) => d.isAfter(startDate))
        .sort((a, b) => a.valueOf() - b.valueOf())[0];
      // If there's a next blocked date, disable dates after it
      // setNextBlockedDate?.(nextBlockedDate ? nextBlockedDate.toDate() : null);
      if (nextBlockedDate && target.isAfter(nextBlockedDate)) {
        console.log("--------------------------------5 ");
        return true;
      }
    }
    if (hasFirstClick) {
      return false;
    } else {
      return blockedDates.includes(target.format("YYYY-MM-DD"));
    }
    // Only disable specifically blocked dates
    // return blockedDates.includes(target.format("YYYY-MM-DD"));
    // return false;
  };
const today = dayjs().startOf("day").format("YYYY-MM-DD");
const start = dayjs(rentStartDate).startOf("day").format("YYYY-MM-DD");
const end = dayjs(rentEndDate).startOf("day").format("YYYY-MM-DD");

useEffect(() => {
  const handleResize = () => {
    setMonthsToShow(window.innerWidth < 768 ? 1 : 2); // md breakpoint is 768px
  };
  handleResize(); // Set on mount
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);


  return (
    <div className="overflow-x-hidden py-6 border-b border-[#262626]/30 pb-12 lg:w-[100%]">
      <h2 className="md:text-xl text-base font-medium capitalize">
        {numberOfNights > 0 && <span>{numberOfNights} nights in </span>}
        <span>{title}</span>
      </h2>
             <p className="mt-1 text-[#262626]/60 text-sm font-medium">
         {dateRange.startDate ? format(dateRange.startDate as Date, "MMM d, yyyy") : "Arrival Date"} -{" "}
         {dateRange.endDate ? format(dateRange.endDate as Date, "MMM d, yyyy") : "Leaving Date"}
       </p>

      <div className="mt-8 w-full">
        <DateRangePicker
          onChange={(item) => {
            setDateRange({
              startDate: item.selection.startDate,
              endDate: item.selection.endDate,
            });
          }}
          moveRangeOnFirstSelection={false}
          months={monthsToShow}
          ranges={[
            {
              startDate: dateRange.startDate || undefined,
              endDate: dateRange.endDate || undefined,
              key: "selection",
            },
          ]}
          minDate={new Date(start || today)}
          maxDate={new Date(end) }
          direction="horizontal"
          disabledDay={disableDate}
          showDateDisplay={false}
          preventSnapRefocus={true}

          className="lg:w-[100%] w-full"
          staticRanges={[]}
          inputRanges={[]}
        />


      </div>
    </div>
  );
};

export default Cleander;



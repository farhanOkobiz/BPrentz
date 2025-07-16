"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
interface Props {
  description: string;
}
const RentDetails: React.FC<Props> = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowToggle, setShouldShowToggle] = useState(false);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (paragraphRef.current) {
      const hasOverflow =
        paragraphRef.current.scrollHeight > paragraphRef.current.clientHeight;
      setShouldShowToggle(hasOverflow);
    }
  }, []);

  return (
    <div className="py-6 border-b border-[#262626]/30 pb-4 w-full md:w-[50%]  lg:w-[50%] xl:w-[60%]">
      <h2 className="text-xl font-medium">Description</h2>

      <p
        ref={paragraphRef}
        className={`py-6 text-[#262626]/70 ${
          !isExpanded ? "line-clamp-2" : ""
        }`}
      >
        {description}
      </p>

      {shouldShowToggle && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="mt-2 font-medium cursor-pointer flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              Show Less <IoIosArrowForward />
            </>
          ) : (
            <>
              Show More <IoIosArrowForward />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default RentDetails;

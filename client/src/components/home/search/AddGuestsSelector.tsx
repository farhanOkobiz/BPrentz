"use client";
import { useState, useRef, useEffect } from "react";
// import { FaUser } from "react-icons/fa";
import { FiPlus, FiMinus } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";

interface GuestSelectorProps {
  type: string;
  count: number;
  onChange: (count: number) => void;
}

const GuestSelector = ({ type, count, onChange }: GuestSelectorProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCountChange = (delta: number) => {
    const newCount = Math.max(count + delta, 0);
    onChange(newCount);
  };

  const clearCount = () => {
    onChange(0);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLabel = () => {
    switch (type) {
      case "bedroom":
        return "Bedrooms";
      case "bathCount":
        return "Bath Count";
      case "bedCount":
        return "Bed Count";
      case "guestCount":
        return "Guests";
      default:
        return "Count";
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="w-full flex items-center justify-between px-4 py-2 rounded-md text-gray-600 bg-[#F5F5F5]"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {count > 0 ? `${count} ${getLabel()}` : `Add ${getLabel()}`}
          </span>
        </div>
        {count > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearCount();
            }}
            className="text-gray-400 hover:text-red-500"
          >
            <RxCross2 size={16} />
          </button>
        )}
      </button>

      {showDropdown && (
        <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg p-4">
          <div className="flex justify-between items-center border-b pb-3">
            <div className="font-medium text-sm text-gray-700">
              {getLabel()}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleCountChange(-1)}
                disabled={count === 0}
                className={`w-8 h-8 border rounded-full flex items-center justify-center ${
                  count === 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600"
                }`}
              >
                <FiMinus />
              </button>
              <span className="w-6 text-center text-sm">{count}</span>
              <button
                type="button"
                onClick={() => handleCountChange(1)}
                className="w-8 h-8 border rounded-full flex items-center justify-center text-gray-600"
              >
                <FiPlus />
              </button>
            </div>
          </div>
          <div className="flex justify-end pt-3">
            <button
              type="button"
              onClick={() => setShowDropdown(false)}
              className="text-sm font-medium text-primary hover:underline"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestSelector;

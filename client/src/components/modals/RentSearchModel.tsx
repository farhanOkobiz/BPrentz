import React, { useState } from "react";
import { HiMiniXMark } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "antd";
import { VscLocation, VscChevronDown, VscChevronUp } from "react-icons/vsc";
import { GoSearch } from "react-icons/go";
import { FaSpinner } from "react-icons/fa";
import GuestSelector from "../home/search/AddGuestsSelector";
import dayjs from "dayjs";
import { useRef } from "react";
import { apiBaseUrl } from "@/config/config";

interface RentSearchModalProps {
  onClose: () => void;
  initialValues: {
    location: string;
    checkinDate: dayjs.Dayjs | null;
    checkoutDate: dayjs.Dayjs | null;
    bedroom: number;
    bathCount: number;
    bedCount: number;
    guestCount: number;
  };
  onSearch: (values: {
    location: string;
    checkinDate: dayjs.Dayjs | null;
    checkoutDate: dayjs.Dayjs | null;
    bedroom: number;
    bathCount: number;
    bedCount: number;
    guestCount: number;
  }) => void;
  loading: boolean;
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, y: "100%" },
};

const RentSearchModal = ({
  onClose,
  initialValues,
  onSearch,
  loading,
}: RentSearchModalProps) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [location, setLocation] = useState(initialValues.location);
  const [checkinDate, setCheckinDate] = useState(initialValues.checkinDate);
  const [checkoutDate, setCheckoutDate] = useState(initialValues.checkoutDate);
  const [guestCounts, setGuestCounts] = useState({
    bedroom: initialValues.bedroom,
    bathCount: initialValues.bathCount,
    bedCount: initialValues.bedCount,
    guestCount: initialValues.guestCount,
  });
  const [locationSuggestions, setLocationSuggestions] = useState<{ _id: string; location: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleGuestCountChange = (newCounts: {
    bedroom: number;
    bathCount: number;
    bedCount: number;
    guestCount: number;
  }) => {
    setGuestCounts(newCounts);
  };

  const toggleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location,
      checkinDate,
      checkoutDate,
      ...guestCounts,
    });
  };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length > 1) {
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`${apiBaseUrl}/location/search/${encodeURIComponent(value)}`);
          console.log("res", res);
          const json = await res.json();
          setLocationSuggestions(json.data || []);
          setShowSuggestions(true);
        } catch {
          setLocationSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (loc: string) => {
    setLocation(loc);
    setShowSuggestions(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-50"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <div
          className="flex items-end justify-center min-h-full p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <motion.div
            className="bg-white w-full max-w-md rounded-t-2xl shadow-xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  Search Properties
                </h2>
                <button
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                  onClick={onClose}
                >
                  <HiMiniXMark className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Location */}
                {/* <div className="bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-lg p-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Where do you want to stay?
                  </label>
                  <div className="flex items-center">
                    <VscLocation className="text-primary mr-2" />
                    <input
                      type="text"
                      placeholder="Search Destinations"
                      className="w-full bg-transparent border-0 focus:outline-none text-sm"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div> */}
                <div className="bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-lg p-3 relative">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Where do you want to stay ?
  </label>
  <div className="flex items-center">
    <VscLocation className="text-primary mr-2" />
    <input
      type="text"
      placeholder="Search Destinations"
      className="w-full bg-transparent border-0 focus:outline-none text-sm"
      value={location}
      onChange={handleLocationChange}
      onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
      autoComplete="off"
    />
  </div>
  {/* Suggestions Dropdown */}
  {showSuggestions && locationSuggestions.length > 0 && (
    <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-y-auto z-20">
      {locationSuggestions.map((item) => (
        <li
          key={item._id}
          className="px-4 py-2 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors duration-150"
          onClick={() => handleSuggestionClick(item.location)}
        >
          <span className="flex items-center gap-2">
            <VscLocation className="text-primary" />
            {item.location}
          </span>
        </li>
      ))}
    </ul>
  )}
</div>

                {/* Check-in Date */}
                <div className="bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-lg p-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in
                  </label>
                  <DatePicker
                    className="w-full bg-transparent border-0 focus:outline-none text-sm"
                    placeholder="Select date"
                    format="YYYY-MM-DD"
                    style={{ border: "none" }}
                    value={checkinDate}
                    onChange={(date) => setCheckinDate(date)}
                  />
                </div>

                {/* Check-out Date */}
                <div className="bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-lg p-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out
                  </label>
                  <DatePicker
                    className="w-full bg-transparent border-0 focus:outline-none text-sm"
                    placeholder="Select date"
                    format="YYYY-MM-DD"
                    style={{ border: "none" }}
                    value={checkoutDate}
                    onChange={(date) => setCheckoutDate(date)}
                  />
                </div>

                {/* More Options Toggle */}
                <button
                  type="button"
                  onClick={toggleMoreOptions}
                  className="w-full flex items-center justify-between bg-[#F5F5F5] hover:bg-gray-100 rounded-lg p-3 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {showMoreOptions ? "Less Options" : "More Options"}
                  </span>
                  {showMoreOptions ? <VscChevronUp /> : <VscChevronDown />}
                </button>

                {/* More Options */}
                {showMoreOptions && (
                  <div className="space-y-4">
                    <div className="bg-[#F5F5F5] border border-transparent hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bedrooms
                      </label>
                      <GuestSelector
                        type="bedroom"
                        count={guestCounts.bedroom}
                        onChange={(count) =>
                          handleGuestCountChange({
                            ...guestCounts,
                            bedroom: count,
                          })
                        }
                      />
                    </div>

                    <div className="bg-[#F5F5F5] border border-transparent hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bath Count
                      </label>
                      <GuestSelector
                        type="bathCount"
                        count={guestCounts.bathCount}
                        onChange={(count) =>
                          handleGuestCountChange({
                            ...guestCounts,
                            bathCount: count,
                          })
                        }
                      />
                    </div>

                    <div className="bg-[#F5F5F5] border border-transparent hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bed Count
                      </label>
                      <GuestSelector
                        type="bedCount"
                        count={guestCounts.bedCount}
                        onChange={(count) =>
                          handleGuestCountChange({
                            ...guestCounts,
                            bedCount: count,
                          })
                        }
                      />
                    </div>

                    <div className="bg-[#F5F5F5] border border-transparent hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Guests
                      </label>
                      <GuestSelector
                        type="guestCount"
                        count={guestCounts.guestCount}
                        onChange={(count) =>
                          handleGuestCountChange({
                            ...guestCounts,
                            guestCount: count,
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 flex items-center justify-center gap-2 mt-4"
                  disabled={loading}
                >
                  {loading && <FaSpinner className="animate-spin" />}
                  <GoSearch />
                  Search Properties
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RentSearchModal;

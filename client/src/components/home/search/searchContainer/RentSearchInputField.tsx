"use client";

import React, { useRef, useState } from "react";
import { GoSearch } from "react-icons/go";
import { VscLocation } from "react-icons/vsc";
import { useRouter, useSearchParams } from "next/navigation";
import dayjs from "dayjs";
import GuestSelector from "../AddGuestsSelector";
import RentSearchModel from "@/components/modals/RentSearchModel";
import { apiBaseUrl } from "@/config/config";
interface RentSearchInputFieldProps {
  params?: {
    location?: string;
    checkinDate?: string;
    checkoutDate?: string;
    bedroomCount?: string;
    bathCount?: string;
    bedCount?: string;
    guestCount?: string;
  };
}

const RentSearchInputField: React.FC<RentSearchInputFieldProps> = ({ params }) => {
  const [openModal, setOpenModal] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

    const [locationSuggestions, setLocationSuggestions] = useState<{ _id: string; location: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);


  console.log("Loading state:", loading);

  // State initialization from URL params
  const [location, setLocation] = useState(params?.location || "");
  const [checkinDate, setCheckinDate] = useState(
    params?.checkinDate ? dayjs(params.checkinDate) : null
  );
  const [checkoutDate, setCheckoutDate] = useState(
    params?.checkoutDate ? dayjs(params.checkoutDate) : null
  );
  const [guestCounts, setGuestCounts] = useState({
    bedroom: params?.bedroomCount ? parseInt(params.bedroomCount) : 0,
    bathCount: params?.bathCount ? parseInt(params.bathCount) : 0,
    bedCount: params?.bedCount ? parseInt(params.bedCount) : 0,
    guestCount: params?.guestCount ? parseInt(params.guestCount) : 0,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newParams = new URLSearchParams(searchParams.toString());

    // Update location
    if (location) newParams.set("location", location);
    else newParams.delete("location");

    // Update dates
    if (checkinDate) newParams.set("checkinDate", checkinDate.format("YYYY-MM-DD"));
    else newParams.delete("checkinDate");

    if (checkoutDate) newParams.set("checkoutDate", checkoutDate.format("YYYY-MM-DD"));
    else newParams.delete("checkoutDate");

    // Update guest counts
    if (guestCounts.bedroom > 0) newParams.set("bedroomCount", guestCounts.bedroom.toString());
    else newParams.delete("bedroomCount");

    if (guestCounts.bathCount > 0) newParams.set("bathCount", guestCounts.bathCount.toString());
    else newParams.delete("bathCount");

    if (guestCounts.bedCount > 0) newParams.set("bedCount", guestCounts.bedCount.toString());
    else newParams.delete("bedCount");

    if (guestCounts.guestCount > 0) newParams.set("guestCount", guestCounts.guestCount.toString());
    else newParams.delete("guestCount");

    await router.push(`/rent?${newParams.toString()}`);
    setLoading(false);
  };

  const toggleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  const handleGuestCountChange = (newCounts: {
    bedroom: number;
    bathCount: number;
    bedCount: number;
    guestCount: number;
  }) => {
    setGuestCounts(newCounts);
  };

   const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setLocation(value);

  if (debounceRef.current) clearTimeout(debounceRef.current);

  if (value.length > 1) {
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/location/search/${encodeURIComponent(value)}`);
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

  return (
    <div>
      <form onSubmit={handleSearch} className="w-full p-4 bg-white shadow-sm rounded-md  mb-5">

        <div className="lg:hidden flex items-center justify-between group">
          <p
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-1 font-medium sm:text-base text-[13px] text-[#262626]/40"
          >
            <span className="text-primary">
              <VscLocation />
            </span>{" "}
            <span>Search for rentals</span>
          </p>
          <p
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-1 text-[#262626]/50 uppercase font-medium group-hover:text-primary duration-300"
          >
            <span>
              <GoSearch />
            </span>
            <span className="tracking-wide cursor-pointer">Search</span>
          </p>
        </div>

        {/* Desktop View */}
        <div className="lg:flex flex-col md:flex-row items-center justify-between gap-4 hidden">
          <div className="grid grid-cols-4 gap-4 w-full">

            <div className="w-full bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md p-2 relative">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Location
  </label>
  <input
    type="text"
    placeholder="Where to?"
    className="w-full px-4 py-2 border-0 rounded-md focus:outline-none bg-[#F5F5F5]"
    value={location}
    onChange={handleLocationChange}
    onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
    autoComplete="off"
  />
  {/* Suggestions Dropdown */}
  {showSuggestions && locationSuggestions.length > 0 && (
    <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-y-auto animate-fadeIn z-20">
      {locationSuggestions.map((item) => (
        <li
          key={item._id}
          className="px-4 py-2 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors duration-150"
          onClick={() => {
            setLocation(item.location);
            setShowSuggestions(false);
          }}
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
            <div className="w-full bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md p-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border-0 rounded-md focus:outline-none bg-[#F5F5F5]"
                value={checkinDate?.format("YYYY-MM-DD") || ""}
                onChange={(e) => setCheckinDate(e.target.value ? dayjs(e.target.value) : null)}
              />
            </div>

            {/* Check-out Date */}
            <div className="w-full bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md p-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border-0 rounded-md focus:outline-none bg-[#F5F5F5]"
                value={checkoutDate?.format("YYYY-MM-DD") || ""}
                onChange={(e) => setCheckoutDate(e.target.value ? dayjs(e.target.value) : null)}
              />
            </div>

            {/* More Options Toggle */}
            <button
              type="button"
              onClick={toggleMoreOptions}
              className="w-full h-full flex items-center justify-center bg-[#F5F5F5] border border-transparent hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary rounded-md transition-colors duration-200 cursor-pointer"
            >
              <label className="text-sm font-medium text-gray-700 cursor-pointer">
                {showMoreOptions ? "Less Options" : "More Options"}
              </label>
            </button>

            {/* Additional Options */}
            {showMoreOptions && (
              <>
                <div className="w-full bg-[#F5F5F5] border border-transparent hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary rounded-md p-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <GuestSelector
                    type="bedroom"
                    count={guestCounts.bedroom}
                    onChange={(count) =>
                      handleGuestCountChange({ ...guestCounts, bedroom: count })
                    }
                  />
                </div>

                <div className="w-full bg-[#F5F5F5] border border-transparent hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary rounded-md p-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <GuestSelector
                    type="bathCount"
                    count={guestCounts.bathCount}
                    onChange={(count) =>
                      handleGuestCountChange({ ...guestCounts, bathCount: count })
                    }
                  />
                </div>

                <div className="w-full bg-[#F5F5F5] border border-transparent hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary rounded-md p-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beds
                  </label>
                  <GuestSelector
                    type="bedCount"
                    count={guestCounts.bedCount}
                    onChange={(count) =>
                      handleGuestCountChange({ ...guestCounts, bedCount: count })
                    }
                  />
                </div>

                <div className="w-full bg-[#F5F5F5] border border-transparent hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary rounded-md p-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <GuestSelector
                    type="guestCount"
                    count={guestCounts.guestCount}
                    onChange={(count) =>
                      handleGuestCountChange({ ...guestCounts, guestCount: count })
                    }
                  />
                </div>
              </>
            )}
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto flex items-end h-full">
            <button
              type="submit"
              className="w-full md:w-auto cursor-pointer px-6 md:py-[25px] bg-primary font-extrabold !text-white rounded-md hover:bg-primary/90 transition flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </form>

      {/* Mobile Modal */}
      {openModal && (
        <RentSearchModel
          onClose={() => setOpenModal(false)}
          initialValues={{
            location,
            checkinDate,
            checkoutDate,
            ...guestCounts
          }}
          loading={loading}
          onSearch={async (values) => {
            setLocation(values.location);
            setCheckinDate(values.checkinDate);
            setCheckoutDate(values.checkoutDate);
            setGuestCounts({
              bedroom: values.bedroom,
              bathCount: values.bathCount,
              bedCount: values.bedCount,
              guestCount: values.guestCount
            });
            setLoading(true);
            const newParams = new URLSearchParams(searchParams.toString());

            if (values.location) newParams.set("location", values.location);
            else newParams.delete("location");

            if (values.checkinDate) newParams.set("checkinDate", values.checkinDate.format("YYYY-MM-DD"));
            else newParams.delete("checkinDate");

            if (values.checkoutDate) newParams.set("checkoutDate", values.checkoutDate.format("YYYY-MM-DD"));
            else newParams.delete("checkoutDate");

            if (values.bedroom > 0) newParams.set("bedroomCount", values.bedroom.toString());
            else newParams.delete("bedroomCount");

            if (values.bathCount > 0) newParams.set("bathCount", values.bathCount.toString());
            else newParams.delete("bathCount");

            if (values.bedCount > 0) newParams.set("bedCount", values.bedCount.toString());
            else newParams.delete("bedCount");

            if (values.guestCount > 0) newParams.set("guestCount", values.guestCount.toString());
            else newParams.delete("guestCount");

            await router.push(`/rent?${newParams.toString()}`);
            setLoading(false);
          }}
        />
      )}
    </div>
  );
};

export default RentSearchInputField;
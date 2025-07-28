"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoSearch } from "react-icons/go";
import { VscLocation } from "react-icons/vsc";
import { useRouter } from "next/navigation";
import { apiBaseUrl } from "@/config/config";

const ParkingSearchInputField = ({ params }) => {
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const debounceRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (location) query.append("location", location);
    if (date) query.append("date", date);
    if (startTime) query.append("start", startTime);
    if (endTime) query.append("end", endTime);
    if (vehicleType) query.append("vehicle", vehicleType);
    router.push(`/parking?${query.toString()}`);
  };

  const handleLocationChange = (e) => {
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

  const handleSuggestionClick = (loc) => {
    setLocation(loc);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSearch} className="w-full p-4 bg-white shadow-sm rounded-md">
      <div className="lg:flex hidden flex-row items-end gap-4">
        <div className="w-full md:w-1/5 bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md p-2 relative">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            placeholder="Enter location"
            className="w-full px-4 py-2 border-0 rounded-md focus:outline-none"
            value={location}
            onChange={handleLocationChange}
            onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
            autoComplete="off"
          />
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

        <div className="w-full md:w-1/5 bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md p-2">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            className="w-full px-4 py-2 border-0 rounded-md focus:outline-none"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="w-full md:w-1/5 bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md p-2">
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="time"
            name="startTime"
            id="startTime"
            className="w-full px-4 py-2 border-0 rounded-md focus:outline-none"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="w-full md:w-1/5 bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md p-2">
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="time"
            name="endTime"
            id="endTime"
            className="w-full px-4 py-2 border-0 rounded-md focus:outline-none"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="w-full md:w-1/5 bg-[#F5F5F5] border border-transparent hover:border-primary focus-within:border-primary focus-within:ring-1 focus-within:ring-primary rounded-md p-2">
          <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Type
          </label>
          <select
            name="vehicleType"
            id="vehicleType"
            className="w-full px-4 py-2 border-0 rounded-md bg-[#F5F5F5] focus:outline-none"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="truck">Truck</option>
          </select>
        </div>

        <div className="w-full md:w-auto flex items-end h-full">
          <button
            type="submit"
            className="w-full md:w-auto cursor-pointer px-6 md:py-[25px] bg-primary font-extrabold !text-white rounded-md hover:bg-primary/90 transition"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default ParkingSearchInputField;

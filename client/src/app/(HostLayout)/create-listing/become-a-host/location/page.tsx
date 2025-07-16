"use client";
import { Input, message } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useListingContext } from "@/contexts/ListingContext";
import { useListingStepContext } from "@/contexts/ListingStepContext";
import { useEffect, useRef, useState } from "react";
import CategoryServices from "@/services/category/category.services";
import { apiBaseUrl } from "@/config/config";

export default function LocationPage() {
  const { listingId, featureType } = useListingContext();
  const { setOnNextSubmit } = useListingStepContext();
  const [messageApi, contextHolder] = message.useMessage();
  const [location, setLocation] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState<{ _id: string; location: string }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const fetchLocation = async () => {
      if (!listingId || !featureType) return;
      try {
        const res: any = await CategoryServices.getListingLocation(
          featureType,
          listingId
        );
        console.log(res, "response Location ");
        setLocation(res?.data?.location || "");
      } catch (error) {
        console.error("Error fetching Location:", error);
      }
    };
    fetchLocation();
  }, [listingId, featureType]);

  const handleSubmit = async () => {
    if (!listingId || !featureType) return;
    try {
      const res = await CategoryServices.updateListingLocation(
        featureType,
        listingId,
        location
      );
      messageApi.success(`Location Updated successfully`);
      console.log("Location updated:", res);
    } catch (err) {
      console.error("Error updating location:", err);
      messageApi.error("Location updated Failed");
      throw err;
    }
  };

  useEffect(() => {
    setOnNextSubmit(handleSubmit);
  }, [location, listingId, featureType]);

  return (
    <div className="min-h-[calc(80vh-100px)] flex items-center justify-center">
      {contextHolder}
      <div className="w-full max-w-3xl space-y-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
            Where’s your place located?
          </h1>
          <p className="text-gray-500 text-sm md:text-base mt-2">
            Your address helps guests find and book your place.
          </p>
        </div>
        <div className="mt-8 relative">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Enter the address or city
          </label>
          <Input
            size="large"
            placeholder="e.g. Dhanmondi, Dhaka"
            prefix={<EnvironmentOutlined />}
            value={location}
            readOnly
            onClick={() => setShowSuggestions(true)}
            className="rounded-xl"
          />

          {showSuggestions && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20">

              <div className="p-2 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search location..."
                  className="w-full px-3 py-2 border rounded focus:outline-none"
                  autoFocus
                  value={searchValue}
                  onChange={async (e) => {
                    const value = e.target.value;
                    setSearchValue(value);
                    if (debounceRef.current) clearTimeout(debounceRef.current);
                    if (value.length > 1) {
                      debounceRef.current = setTimeout(async () => {
                        try {
                          const res = await fetch(`${apiBaseUrl}/location/search/${encodeURIComponent(value)}`);
                          const json = await res.json();
                          setLocationSuggestions(json.data || []);
                        } catch {
                          setLocationSuggestions([]);
                        }
                      }, 300);
                    } else {
                      setLocationSuggestions([]);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && locationSuggestions.length === 0 && searchValue.trim().length > 0) {
                      setLocation(searchValue.trim());
                      setShowSuggestions(false);
                    }
                  }}
                />
              </div>

              {locationSuggestions.length > 0 ? (
                <ul className="max-h-56 overflow-y-auto">
                  {locationSuggestions.map((item) => (
                    <li
                      key={item._id}
                      className="px-4 py-2 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors duration-150"
                      onClick={() => {
                        setLocation(item.location);
                        setShowSuggestions(false);
                        setSearchValue("");
                      }}
                    >
                      {item.location}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 text-gray-400 flex items-center gap-2">
                  No locations found
                  {searchValue.trim().length > 0 && (
                    <button
                      className="ml-auto px-3 py-1 bg-primary text-white rounded text-xs hover:bg-primary/90"
                      onClick={() => {
                        setLocation(searchValue.trim());
                        setShowSuggestions(false);
                      }}
                    >
                      {`Use "${searchValue.trim()}"`}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

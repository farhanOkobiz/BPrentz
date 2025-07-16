import { apiBaseUrl } from "@/config/config";
import { IAmenities } from "@/types";
import Image from "next/image";
import React from "react";

interface Props {
  amenities: IAmenities[];
}

const AmenitiesForRent: React.FC<Props> = ({ amenities }) => {
  return (
    <div className="py-6 border-b border-[#262626]/30 pb-6 xl:w-[60%] w-full">
      <h2 className="text-xl font-medium">House Details</h2>
      <div className="flex items-center flex-wrap gap-2 mt-4 pb-2">
        {amenities?.map((amenitie: IAmenities) => (
          <div
            key={amenitie._id}
            className="px-4 py-2 rounded bg-[#F2F2F5] text-[#262626]/80 text-sm flex items-center gap-1"
          >
            <div className="w-[30px]">
              <Image
                src={apiBaseUrl + amenitie.amenitiesImage}
                alt={amenitie.amenitiesLabel}
                width={30}
                height={30}
              />
            </div>
            <p>{amenitie.amenitiesLabel}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesForRent;

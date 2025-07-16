import React from "react";

interface Props {
  amenities: string[];
}

const AmenitiesForFlat: React.FC<Props> = ({ amenities }) => {
  return (
    <div className="py-6 border-b border-[#262626]/30 lg:w-[60%]">
      <h2 className="text-xl font-medium">Flat Details</h2>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        {amenities?.map((amenity, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-4 py-2 rounded bg-[#F2F2F5] text-[#262626]/80 text-sm"
          >
            <p className="capitalize">{amenity}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesForFlat;

import { poppins } from "@/app/font";
import { apiBaseUrl } from "@/config/config";
import { IRent } from "@/types";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BsCalendar2Date, BsHouses, BsPeople } from "react-icons/bs";
import { LiaBathSolid } from "react-icons/lia";
import { LuBed } from "react-icons/lu";
import { MdOutlineKingBed } from "react-icons/md";
import { PiHouseLine, PiMapPin } from "react-icons/pi";

interface Props {
  rent: IRent;
  linkPrefix: string;
}

const RentCard: React.FC<Props> = ({ rent, linkPrefix }) => {
  const {
    title,
    coverImage,
    floorPlan,
    price,
    location,
    slug,
    buildingYear,
    status,
  } = rent;
  const href = `/${linkPrefix}/${slug}`;

  return (
    <Link
      href={href}
      className={`block rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden ${poppins.className}`}
    >
      {/* IMAGE */}
      <div className="relative w-full h-56 md:h-48 lg:h-56">
        {coverImage ? (
          <Image
            src={apiBaseUrl + coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="bg-gray-100 w-full h-full flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
      </div>

      {/* INFO CONTAINER */}
      <div className="p-5 flex flex-col gap-3">
        {/* Title and Location */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</h3>

          <div className="flex items-center text-sm text-gray-600 mt-1 sm:mt-0">
            <PiMapPin className="mr-1 text-primary" />
            <span className="truncate max-w-[150px]">{location}</span>
          </div>
        </div>

        {/* Price and Status */}
        <div className="flex items-center justify-between text-primary font-bold text-xl">
          <span>
            ৳ {price}
            {status && <span className="text-sm font-normal ml-1 text-gray-500">/ night</span>}
          </span>

          {status && (
            <span className="bg-primary/20 text-primary uppercase text-xs font-semibold rounded-full px-3 py-1 select-none">
              {status}
            </span>
          )}
        </div>

        {/* Floor Plan Details */}
        {floorPlan && (
          <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
            {floorPlan.bedroomCount > 0 && (
              <div className="flex items-center gap-1" title="Bedrooms">
                <MdOutlineKingBed className="text-primary" />
                <span>{floorPlan.bedroomCount} Bedroom{floorPlan.bedroomCount > 1 ? "s" : ""}</span>
              </div>
            )}
            {floorPlan.bathCount > 0 && (
              <div className="flex items-center gap-1" title="Bathrooms">
                <LiaBathSolid className="text-primary" />
                <span>{floorPlan.bathCount} Bath{floorPlan.bathCount > 1 ? "s" : ""}</span>
              </div>
            )}
            {floorPlan.bedCount > 0 && (
              <div className="flex items-center gap-1" title="Beds">
                <LuBed className="text-primary" />
                <span>{floorPlan.bedCount} Bed{floorPlan.bedCount > 1 ? "s" : ""}</span>
              </div>
            )}
            {floorPlan.guestCount > 0 && (
              <div className="flex items-center gap-1" title="Guests">
                <BsPeople className="text-primary" />
                <span>{floorPlan.guestCount} Guest{floorPlan.guestCount > 1 ? "s" : ""}</span>
              </div>
            )}
            {floorPlan.drawing && (
              <div className="flex items-center gap-1" title="Drawing Room">
                <PiHouseLine className="text-primary" />
                <span>Drawing</span>
              </div>
            )}
            {floorPlan.dinning && (
              <div className="flex items-center gap-1" title="Dining Room">
                <BsHouses className="text-primary" />
                <span>Dining</span>
              </div>
            )}
          </div>
        )}

        {/* Building Year */}
        {buildingYear && (
          <div className="flex items-center text-gray-500 text-sm gap-1 mt-2">
            <BsCalendar2Date />
            <span>{buildingYear}</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default RentCard;

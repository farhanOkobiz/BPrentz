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
    <div
      className={`rounded shadow-sm hover:shadow-md group cursor-pointer border border-transparent hover:border-primary/30 duration-300 ${poppins.className}`}
    >
      <Link href={href}>
        <div className="h-[280px] overflow-hidden relative group">
          {coverImage && (
            <Image
              src={apiBaseUrl + coverImage}
              alt={title}
              priority
              width={300}
              height={300}
              className="w-full h-full rounded-t object-cover transition-transform duration-700 group-hover:scale-110"
            />
          )}
          <div className="absolute top-[-100%] left-0 w-full h-full bg-[#fff]/16 transition-all duration-700 group-hover:top-0"></div>
        </div>
      </Link>
      <Link href={href}>
        <div className="px-4 py-4">
          <h2 className="line-clamp-1  font-medium text-base">{title}</h2>
          <p className="flex items-center gap-2 mt-2">
            <span className="p-1 bg-primary/10 text-primary rounded">
              <PiMapPin className="text-lg" />
            </span>
            <span className="line-clamp-1 text-[#262626]/60 text-sm">
              {location}
            </span>
          </p>
          <div className=" mt-4 flex items-center0">
            <span className="font-medium text-xl">৳ {price}</span>

            <p>{status && <span>/night</span>}</p>
          </div>

          <div className="flex items-center flex-wrap gap-2 my-2 text-sm text-[#262626]/60">
            {floorPlan && (
              <>
                {floorPlan.bedroomCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span>
                      <MdOutlineKingBed />
                    </span>
                    <span>
                      {floorPlan.bedroomCount} Bedroom
                      {floorPlan.bedroomCount > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {floorPlan.bathCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span>
                      <LiaBathSolid />
                    </span>
                    <span>
                      {floorPlan.bathCount} Bath
                      {floorPlan.bathCount > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {floorPlan.bedCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span>
                      <LuBed />
                    </span>
                    <span>
                      {floorPlan.bedCount} Bed
                      {floorPlan.bedCount > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
                {floorPlan.guestCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span>
                      <BsPeople />
                    </span>
                    <span>
                      {floorPlan.guestCount} Guest
                      {floorPlan.guestCount > 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                {floorPlan?.drawing == true && (
                  <div className="flex items-center gap-1">
                    <PiHouseLine />

                    <span>
                      {floorPlan.guestCount} Drawing
                      {floorPlan.guestCount > 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                {floorPlan?.dinning == true && (
                  <div className="flex items-center gap-1">
                    <BsHouses />

                    <span>
                      {floorPlan.guestCount} Dinning
                      {floorPlan.guestCount > 1 ? "s" : ""}
                    </span>
                  </div>
                )}

                <div>
                  {buildingYear && (
                    <p className="flex item-center gap-1">
                      <span>
                        <BsCalendar2Date className="pt-1" />
                      </span>
                      <span> {buildingYear} Year</span>
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RentCard;

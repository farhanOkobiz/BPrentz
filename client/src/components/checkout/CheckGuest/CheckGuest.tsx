"use client";
import { poppins } from "@/app/font";
import CheckGuestsModel from "@/components/modals/CheckGuestsModel";
import { useDateRange } from "@/contexts/DateRangeContext";
import { useState } from "react";
export interface GuestInfo {
  adults: number;
  younger: number;
  infants: number;
  totalGuest: number;
}

const CheckGuest = () => {
  const [openModal, setOpenModal] = useState(false);
  const { guestInfo, setGuestInfo } = useDateRange();
  const handleGuestChange = (
    type: "guests" | "younger" | "infants",
    value: number
  ) => {
    setGuestInfo({
      ...guestInfo,
      [type]: value,
    });
  };                    

  return (
    <div>
      <div
        className={`flex justify-between border-b pb-6 border-[#262626]/30 ${poppins.className}`}
      >
        <div>
          <h2 className="font-medium">Guests</h2>
          <p className="text-[#262626]/60 text-sm">
            {guestInfo.totalGuest} guest
          </p>
        </div>
        {/* <div>
          <p
            className="font-medium underline cursor-pointer"
            onClick={() => setOpenModal(true)}
          >
            Edit
          </p>             
        </div> */}
      </div>

      {openModal && (
        <CheckGuestsModel
          guests={guestInfo.guests}
          setGuests={(val) => handleGuestChange("guests", val)}
          // younger={guestInfo.younger}
          // setYounger={(val) => handleGuestChange("younger", val)}
          // infants={guestInfo.infants}
          // setInfants={(val) => handleGuestChange("infants", val)}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default CheckGuest;

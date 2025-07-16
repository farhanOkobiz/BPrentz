"use client";
import { poppins } from "@/app/font";
import LandAppointmentModel from "@/components/modals/LandAppointmentModel";
import React, { useEffect, useRef, useState } from "react";
import { MdWhatsapp } from "react-icons/md";

interface Props {
  title: string;
  landId: string;
}
const LandAppointment: React.FC<Props> = ({ title, landId }) => {
  const [appintment, setAppintment] = useState(false);

  const appintmentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside2 = (event: MouseEvent) => {
      if (
        appintmentRef.current &&
        !appintmentRef.current.contains(event.target as Node)
      ) {
        setAppintment(false);
      }
    };

    if (appintment) {
      document.addEventListener("mousedown", handleClickOutside2);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside2);
    };
  }, [appintment]);
  return (
    <div>
      <div className="flex item-center gap-2">
        <button
          onClick={() => setAppintment(true)}
          className={`border border-primary rounded md:text-base text-sm text-primary hover:bg-primary hover:text-[#fff] duration-300 h-10 px-2 font-medium cursor-pointer ${poppins.className}`}
        >
          Book Appointment
        </button>
        <a
          href="https://wa.me/+8801716147486"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 h-10 text-2xl pt-2 bg-[#0CC143] rounded text-[#fff] flex item-center justify-center cursor-pointer"
        >
          <MdWhatsapp />
        </a>
      </div>

      {appintment && (
        <div className="fixed top-0 right-0 w-full h-screen bg-[#262626]/40 z-50">
          <div ref={appintmentRef}>
            <LandAppointmentModel
              title={title}
              landId={landId}
              onClose={() => setAppintment(false)}
            />
          </div>
        </div>
      )}

      {/* {showContact && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999]">
          <div ref={modalRef}>
            <ContactHostModel setShowContact={setShowContact} />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default LandAppointment;

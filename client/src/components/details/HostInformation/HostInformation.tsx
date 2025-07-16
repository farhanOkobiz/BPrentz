"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import defualtUser from "@/assets/user/avatar.png";
import { PiSealCheckFill, PiShieldCheck } from "react-icons/pi";
import ContactHostModel from "@/components/modals/ContactHostModel";

const HostInformation = () => {
  const [showContact, setShowContact] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowContact(false);
      }
    };

    if (showContact) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showContact]);

  return (
    <div>
      <div className="flex items-center md:gap-4 gap-2">
        <div className="md:border-2 border border-[#262626]/30 md:rounded-full rounded">
          <Image
            src={defualtUser}
            alt="user"
            width={30}
            height={30}
            className="opacity-50 mt-1"
          />
        </div>
        <div className="flex flex-col">
          <h2 className="md:text-xl text-lg font-medium flex items-center gap-2">
            Hosted by <span>Mishu</span>
            <span className="text-[#2F80ED]">
              <PiSealCheckFill />
            </span>
          </h2>
          <div className="flex items-center flex-wrap gap-4">
            <div className="flex items-center gap-1">
              <PiShieldCheck className="text-lg text-[#2F80ED]" />
              <span className="text-[#262626]/70 font-medium md:text-base text-sm">
                Joined in 3 May 2025
              </span>
            </div>
            {/* <div className="flex items-center gap-1">
              <FaStar className="text-[#FFA412] text-lg" />
              <span className="text-sm text-[#262626]/70 font-medium">
                2 Reviews
              </span>
            </div> */}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setShowContact(true)}
          className="px-3 py-2 rounded text-primary text-sm font-medium hover:bg-primary hover:text-white duration-300 border border-primary"
        >
          Contact Host
        </button>
        <p className="flex md:items-center items-start gap-2 py-4">
          <span className="md:text-lg text-xl w-8 h-8 text-primary">
            {" "}
            <PiShieldCheck />
          </span>
          <span className="text-sm text-[#262626]/60">
            To protect your payment, never transfer money or communicate outside
            of the Stayverz website or app.
          </span>
        </p>
      </div>

      {showContact && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[999]">
          <div ref={modalRef}>
            <ContactHostModel setShowContact={setShowContact} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HostInformation;

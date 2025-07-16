"use client";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { RxHome } from "react-icons/rx";

import Link from "next/link";
import { RiBuilding2Line } from "react-icons/ri";
import { RiLandscapeLine } from "react-icons/ri";

const DownFooter = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled past 100px
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Check if the user has reached the bottom of the page
      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight;

      if (isBottom) {
        setIsVisible(false); // Hide the footer when at the bottom of the page
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    // <div className="fixed bottom-0 md:py-12 py-2 w-full bg-[#fff] shadow-2xl z-[999]">
    <div
      className={`fixed  bottom-0 md:py-12 py-4 w-full bg-[#fff] shadow-2xl border-t border-[#1D4095] z-[999]  transition-transform duration-300 left-0 ${
        isVisible ? "translate-y-0 " : "translate-y-full"
      } md:hidden`}
    >
      <div className="px-12 flex items-center justify-between">
        {/* <Link href="/contact">
          <div className="flex flex-col items-center justify-between capitalize text-sm font-semibold">
            <p>
              <LuContact className="text-lg text-[#1D4095]" />
            </p>
            <p className="text-[#1D4095]"> Contact</p>
          </div>
        </Link> */}

        <Link href="/">
          <div className="flex flex-col items-center justify-between capitalize text-[#262626]/80 hover:text-primary duration-300">
            <p>
              <IoSearchOutline className="text-xl" />
            </p>
            <p className="text-[12px]">Explore</p>
          </div>
        </Link>

        <Link href="/rent">
          <div className="flex flex-col items-center justify-between capitalize text-[#262626]/80 hover:text-primary duration-300">
            <p>
              <RxHome className="text-xl" />
            </p>
            <p className="text-[12px]">Room</p>
          </div>
        </Link>

        <Link href="/flat">
          <div className="flex flex-col items-center justify-between capitalize text-[#262626]/80 hover:text-primary duration-300">
            <p>
              <RiBuilding2Line className="text-xl" />
            </p>
            <p className="text-[12px]">Flats</p>
          </div>
        </Link>

        <Link href="/land">
          <div className="flex flex-col items-center justify-between capitalize cursor-pointer text-[#262626]/80 hover:text-primary duration-300">
            <p>
              <RiLandscapeLine className="text-xl" />
            </p>
            <p className="text-[12px]">Land</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DownFooter;

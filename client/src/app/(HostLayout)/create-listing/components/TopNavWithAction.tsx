"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "antd";
import logo from "@/assets/logo/homzystay.png";
import Link from "next/link";

const TopNavWithAction = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/host-dashboard/listings");
    localStorage.removeItem("listingId");
  };

  return (
    <div className="Container bg-white sticky-top shadow-sm py-3 px-4 md:px-10 flex justify-between items-center">
      <Link href={"#"} className="w-[140px] md:w-[180px]">
        <Image
          src={logo}
          alt="logo"
          width={160}
          height={160}
          className="w-full h-full"
        />
      </Link>

      <Button
        onClick={handleNext}
        className="!rounded-full !bg-white !border !border-amber-400 !font-bold  px-6 py-2 text-base"
      >
        Save & Exit
      </Button>
    </div>
  );
};

export default TopNavWithAction;

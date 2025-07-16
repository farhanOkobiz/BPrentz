"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AiTwotonePlusCircle } from "react-icons/ai";
import { Tooltip } from "antd";
import { IProfile } from "@/types/profileTypes/profiletypes";
import { ProfileServices } from "@/services/profile/profile.services";
import { AccountStatus } from "@/utilits/accountstatusEnum";

export default function TodayHeader() {
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const status = profile?.user?.accountStatus;

  const isAllowed =
    status === AccountStatus.ACTIVE && profile?.user?.role === "host";

  const getTooltipMessage = () => {
    switch (status) {
      case AccountStatus.PENDING:
        return "আপনার পরিচয় যাচাই প্রক্রিয়াধীন রয়েছে। অনুগ্রহ করে আপনার প্রোফাইলে গিয়ে পরিচয়পত্র যাচাই করুন।";
      case AccountStatus.SUSPENDED:
        return "আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে।";
      case AccountStatus.REJECTED:
        return "আপনার পরিচয় যাচাই প্রত্যাখ্যাত হয়েছে। অনুগ্রহ করে পুনরায় যাচাই করুন।";
      case AccountStatus.INACTIVE:
        return "আপনার অ্যাকাউন্টটি সক্রিয় নয়। অনুগ্রহ করে  আপনার প্রোফাইলে গিয়ে অ্যাকাউন্ট সক্রিয় করুন।";
      default:
        return "আপনার পরিচয় যাচাই প্রক্রিয়াধীন রয়েছে। অনুগ্রহ করে আপনার প্রোফাইলে গিয়ে পরিচয়পত্র যাচাই করুন।";
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await ProfileServices.processGetProfile();
        setProfile(res?.data);
        console.log(res.data, "profile info ");
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);



  return (
    <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-6 px-4 sm:px-6 bg-white">
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900">
          Welcome Back
        </h1>
      </div>

      {loading ? null : isAllowed ? (
        <Link href="/create-listing/become-a-host">
          <button
            type="button"
            className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-md hover:shadow-lg cursor-pointer"
          >
            <AiTwotonePlusCircle className="text-xl" />
            <span> Create List</span>
          </button>
        </Link>
      ) : (
        <Tooltip title={getTooltipMessage()}>
          <div className="flex items-center gap-2 bg-gray-400 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-md cursor-not-allowed">
            <AiTwotonePlusCircle className="text-xl" />
            <span> Create List</span>
          </div>
        </Tooltip>
      )}
    </div>
  );
}

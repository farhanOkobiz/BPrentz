"use client";

import React, { useEffect, useState } from "react";
import { AiTwotonePlusCircle } from "react-icons/ai";
import Link from "next/link";
import { Pagination, Tabs, Tooltip } from "antd";
import type { TabsProps } from "antd";
import { IFlatData, ILandData, IRent } from "@/types";
import { getAllHostRents } from "@/services/rents";
import { getAllHostFlats } from "@/services/flats";
import { getAllHostLands } from "@/services/land";
import RentList from "./RentList";
import FlatList from "./FlatList";
import LandList from "./LandList";
import { IProfile } from "@/types/profileTypes/profiletypes";
import { ProfileServices } from "@/services/profile/profile.services";

interface RentTableProps {
  rents: IRent[];
  rentPage: number;
  rentTotal: number;
  onPageChange: (page: number) => void;
  refetchRents: (page: number) => Promise<void>;
  updateRentImages: (rentId: string, newImages: string[]) => void;
}

interface FlatTableProps {
  flats: IFlatData[];
  flatPage: number;
  totalFlat: number;
  refetchFlats: (page: number) => Promise<void>;
  onPageChange: (page: number) => void;
  updateFlatImages: (flatId: string, newImages: string[]) => void;
}

interface LandTableProps {
  lands: ILandData[];
  landPage: number;
  totalLand: number;
  refetchLands: (page: number) => Promise<void>;
  onPageChange: (page: number) => void;
  updateLandImages: (landId: string, newImages: string[]) => void;
}

const ListingsPage = () => {
  const [rents, setRents] = useState<IRent[]>([]);
  const [rentPage, setRentPage] = useState(1);
  const [flatPage, setFlatPage] = useState(1);
  const [landPage, setLandPage] = useState(1);
  const [totalLand, setTotalLand] = useState(0);
  const [rentTotal, setRentTotal] = useState(0);
  const [totalFlat, setTotalFlat] = useState(0);
  const [flats, setFlats] = useState<IFlatData[]>([]);
  const [lands, setLands] = useState<ILandData[]>([]);
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAllowed =
    profile?.user?.accountStatus === "active" && profile?.user?.role === "host";

  const getTooltipMessage = () => {
    const status = profile?.user?.accountStatus;
    switch (status) {
      case "pending":
        return "আপনার পরিচয় যাচাই প্রক্রিয়াধীন রয়েছে। অনুগ্রহ করে আপনার প্রোফাইলে গিয়ে পরিচয়পত্র যাচাই করুন।";
      case "suspended":
        return "আপনার একাউন্ট সাময়িকভাবে স্থগিত করা হয়েছে। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।";
      case "rejected":
        return "আপনার একাউন্টটি বাতিল করা হয়েছে। আরও তথ্যের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।";
      default:
        return "আপনার পরিচয় যাচাই প্রক্রিয়াধীন রয়েছে। অনুগ্রহ করে আপনার প্রোফাইলে গিয়ে পরিচয়পত্র যাচাই করুন।";
    }
  };

  const fetchRents = async (page = 1) => {
    const token = localStorage.getItem("accessToken") || "";
    const res = await getAllHostRents(token, page);
    setRents(res.data);
    setRentTotal(res.totalContacts);
    setRentPage(page);
  };

  const fetchFlats = async (page = 1) => {
    const token = localStorage.getItem("accessToken") || "";
    const res = await getAllHostFlats(token, page);
    setFlats(res.data);
    setTotalFlat(res.totalContacts);
    setFlatPage(page);
  };

  const fetchLands = async (page = 1) => {
    const token = localStorage.getItem("accessToken") || "";
    const res = await getAllHostLands(token, page);
    setLands(res.data);
    setTotalLand(res.totalContacts);
    setLandPage(page);
  };
  const updateRentImages = (rentId: string, newImages: string[]) => {
    setRents((prevRent) =>
      prevRent.map((rent) =>
        rent._id === rentId ? { ...rent, images: newImages } : rent
      )
    );
  };
  const updateLandImages = (landId: string, newImages: string[]) => {
    setLands((prevLands) =>
      prevLands.map((land) =>
        land._id === landId ? { ...land, images: newImages } : land
      )
    );
  };
  const updateFlatImages = (flatId: string, newImages: string[]) => {
    setFlats((prevFlats) =>
      prevFlats.map((flat) =>
        flat._id === flatId ? { ...flat, images: newImages } : flat
      )
    );
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await ProfileServices.processGetProfile();
        setProfile(profileRes?.data);
        await fetchRents();
        await fetchFlats();
        await fetchLands();
      } catch (error) {
        console.error("Error fetching listings or profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: <span className="text-base">Room</span>,
      children: (
        <RentTable
          rents={rents}
          rentPage={rentPage}
          rentTotal={rentTotal}
          onPageChange={(page) => fetchRents(page)}
          refetchRents={fetchRents}
          updateRentImages={updateRentImages}
        />
      ),
    },
    {
      key: "2",
      label: <span className="text-base">Flat</span>,
      children: (
        <FlatTable
          flatPage={flatPage}
          totalFlat={totalFlat}
          flats={flats}
          onPageChange={(page) => fetchFlats(page)}
          refetchFlats={fetchFlats}
          updateFlatImages={updateFlatImages}
        />
      ),
    },
    {
      key: "3",
      label: <span className="text-base">Land</span>,
      children: (
        <LandTable
          lands={lands}
          totalLand={totalLand}
          landPage={landPage}
          onPageChange={(page) => fetchLands(page)}
          refetchLands={fetchLands}
          updateLandImages={updateLandImages}
        />
      ),
    },
  ];

  return (
    <div className="Container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          My Listings
        </h1>

        {loading ? null : isAllowed ? (
          <Link href="/create-listing/become-a-host">
            <button
              type="button"
              className="flex items-center gap-2 bg-primary hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              <AiTwotonePlusCircle className="text-xl" />
              <span className="text-base">Create Listing</span>
            </button>
          </Link>
        ) : (
          <Tooltip title={getTooltipMessage()}>
            <div className="flex items-center gap-2 bg-gray-400 text-white font-semibold py-2 px-4 rounded-full transition duration-300 shadow-md cursor-not-allowed">
              <AiTwotonePlusCircle className="text-xl" />
              <span className="text-base">Create Listing</span>
            </div>
          </Tooltip>
        )}
      </div>

      <Tabs defaultActiveKey="1" items={tabItems} className="text-lg" />
    </div>
  );
};

const RentTable = ({
  rents,
  rentPage,
  rentTotal,
  onPageChange,
  refetchRents,
  updateRentImages,
}: RentTableProps) => (
  <div>
    <RentList
      rents={rents}
      rentPage={rentPage}
      refetchRents={() => refetchRents(rentPage)}
      updateRentImages={updateRentImages}
    />
    <div className="mt-6 flex justify-center">
      <Pagination
        current={rentPage}
        total={rentTotal}
        pageSize={8}
        onChange={onPageChange}
        showSizeChanger={false}
      />
    </div>
  </div>
);

const FlatTable = ({
  flats,
  flatPage,
  totalFlat,
  onPageChange,
  refetchFlats,
  updateFlatImages,
}: FlatTableProps) => (
  <div>
    <FlatList
      flats={flats}
      flatPage={flatPage}
      refetchFlats={() => refetchFlats(flatPage)}
      updateFlatImages={updateFlatImages}
    />
    <div className="mt-6 flex justify-center">
      <Pagination
        current={flatPage}
        total={totalFlat}
        pageSize={8}
        onChange={onPageChange}
        showSizeChanger={false}
      />
    </div>
  </div>
);

const LandTable = ({
  lands,
  landPage,
  totalLand,
  onPageChange,
  refetchLands,
  updateLandImages,
}: LandTableProps) => (
  <div>
    <LandList
      lands={lands}
      landPage={landPage}
      refetchLands={() => refetchLands(landPage)}
      updateLandImages={updateLandImages}
    />
    <div className="mt-6 flex justify-center">
      <Pagination
        current={landPage}
        total={totalLand}
        pageSize={8}
        onChange={onPageChange}
        showSizeChanger={false}
      />
    </div>
  </div>
);

export default ListingsPage;

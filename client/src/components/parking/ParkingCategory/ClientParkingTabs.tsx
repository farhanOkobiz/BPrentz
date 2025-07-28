"use client";

import { Tabs } from "antd";

import { SearchParams } from "next/dist/server/request/search-params";
import ParkingSearchInputField from "@/components/home/search/searchContainer/ParkingSearchInputField";

interface ClientRentTabsProps {
  params: SearchParams;
}

export default function ClientParkingTabs({ params }: ClientRentTabsProps) {
  const tabClass =
    "text-white bg-secondary !inline-block lg:px-4 px-2 py-1 lg:py-2 rounded";

  const items = [
    {
      key: "parking",
      label: <div className={tabClass}>Parking</div>,
      children: <ParkingSearchInputField params={params} />, 
    },
  ];

  return <Tabs defaultActiveKey="rent" type="card" items={items} />;
}

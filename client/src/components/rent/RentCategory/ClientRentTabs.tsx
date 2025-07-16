"use client";

import { Tabs } from "antd";

import RentSearchInputField from "@/components/home/search/searchContainer/RentSearchInputField";
import { SearchParams } from "next/dist/server/request/search-params";

interface ClientRentTabsProps {
  params: SearchParams;
}

export default function ClientRentTabs({ params }: ClientRentTabsProps) {
  const tabClass =
    "text-white bg-[#F2693C] !inline-block lg:px-4 px-2 py-1 lg:py-2 rounded lg:w-[60px] w-[50px]";

  const items = [
    {
      key: "rent",
      label: <div className={tabClass}>Rent</div>,
      children: <RentSearchInputField params={params} />,
    },
  ];

  return <Tabs defaultActiveKey="rent" type="card" items={items} />;
}

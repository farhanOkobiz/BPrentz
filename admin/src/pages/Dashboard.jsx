import {
  CarryOutOutlined,
  DeleteOutlined,
  DollarOutlined,
  MoneyCollectOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

import React from "react";
import DashboardCountCard from "../components/dashboard/DashboardCountCard";
import PageTitle from "../utils/PageTitle";

const Dashboard = () => {
  return (
    <>
      <PageTitle title={"Dashboard"} />
      <div className="bg-white my-6 p-8 rounded-md">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        <h1 className="text-xl font-semibold mb-3">Property Summary</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <DashboardCountCard
            value={120}
            label="Total Rent Listings"
            bgColor="#E8F5E9"
            icon={<ShoppingCartOutlined />}
          />
          <DashboardCountCard
            value={80}
            label="Total Flat Buy/Sell"
            bgColor="#E3F2FD"
            icon={<DollarOutlined />}
          />
          <DashboardCountCard
            value={45}
            label="Total Land Buy/Sell"
            bgColor="#FFF3E0"
            icon={<MoneyCollectOutlined />}
          />
          <DashboardCountCard
            value={30}
            label="Total Suspended Listings"
            bgColor="#FFEBEE"
            icon={<DeleteOutlined />}
          />
        </div>

        <h1 className="text-xl font-semibold mb-3">Booking Summary</h1>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <DashboardCountCard
            value={65}
            label="Total Rent Bookings"
            bgColor="#F1F8E9"
            icon={<CarryOutOutlined />}
          />
          <DashboardCountCard
            value={1500000}
            label="Total Revenue (₹)"
            bgColor="#FFFDE7"
            icon={<MoneyCollectOutlined />}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;

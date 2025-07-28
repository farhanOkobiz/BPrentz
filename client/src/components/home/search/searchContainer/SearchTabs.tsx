import { Tabs } from "antd";
import RentSearchInputField from "./RentSearchInputField";
import LandSearchInputField from "./LandSearchInputField";
import FlatSearchInputField from "./FlatSearchInputField";
import ParkingSearchInputField from "./ParkingSearchInputField";

const SearchTabs = () => {
  const tabClass =
    "text-white bg-secondary !inline-block lg:px-4 px-2 py-1 lg:py-2 rounded ";

  const items = [
    {
      key: "rent",
      label: <div className={tabClass}>Room</div>,
      children: <RentSearchInputField />,
    },
    {
      key: "parking",
      label: <div className={tabClass}>Parking</div>,
      children: <ParkingSearchInputField />,
    },
    {
      key: "land",
      label: <div className={tabClass}>Land</div>,
      children: <LandSearchInputField />,
    },
    {
      key: "flat",
      label: <div className={tabClass}>Flat</div>,
      children: <FlatSearchInputField />,
    },
  ];

  return (
    <Tabs defaultActiveKey="rent" type="card" items={items} className="" />
  );
};

export default SearchTabs;

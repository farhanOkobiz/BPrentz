"use client";

import { IRent, ICategory } from "@/types";
import ParkingCategory from "../ParkingCategory/ParkingCategory";
import ParkingList from "./ParkingList";
interface ClientRentViewProps {
  parkings: IRent[];
  total: number;
  currentPage: number;
  parkingCategories: ICategory[];
  selectedCategoryId: string;
}

const ClientParkingView: React.FC<ClientRentViewProps> = ({
  parkings,
  total,
  currentPage,
  parkingCategories,
  selectedCategoryId,
}) => {
  return (
    <>
      <ParkingCategory
        parkingCategories={parkingCategories}
        selectedCategoryId={selectedCategoryId}
      />

      <ParkingList parkings={parkings} total={total} currentPage={currentPage} />
    </>
  );
};

export default ClientParkingView;

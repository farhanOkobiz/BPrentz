"use client";

import { IRent, ICategory } from "@/types";
import ParkingCategory from "../ParkingCategory/ParkingCategory";
import ParkingList from "./ParkingList";
interface ClientRentViewProps {
  rents: IRent[];
  total: number;
  currentPage: number;
  rentCategories: ICategory[];
  selectedCategoryId: string;
}

const ClientParkingView: React.FC<ClientRentViewProps> = ({
  rents,
  total,
  currentPage,
  rentCategories,
  selectedCategoryId,
}) => {
  return (
    <>
      <ParkingCategory
        rentCategories={rentCategories}
        selectedCategoryId={selectedCategoryId}
      />

      <ParkingList rents={rents} total={total} currentPage={currentPage} />
    </>
  );
};

export default ClientParkingView;

"use client";

import { IRent, ICategory } from "@/types";
import RentCategory from "../RentCategory/RentCategory";
import RentList from "./RentList";

interface ClientRentViewProps {
  rents: IRent[];
  total: number;
  currentPage: number;
  rentCategories: ICategory[];
  selectedCategoryId: string;
}

const ClientRentView: React.FC<ClientRentViewProps> = ({
  rents,
  total,
  currentPage,
  rentCategories,
  selectedCategoryId,
}) => {
  return (
    <>
      <RentCategory
        rentCategories={rentCategories}
        selectedCategoryId={selectedCategoryId}
      />

      <RentList rents={rents} total={total} currentPage={currentPage} />
    </>
  );
};

export default ClientRentView;

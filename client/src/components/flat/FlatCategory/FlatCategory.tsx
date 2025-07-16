"use client";
import { poppins } from "@/app/font";
import { ICategory } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  rentCategories: ICategory[];
  selectedCategoryId: string;
}

const FlatCategory: React.FC<Props> = ({
  rentCategories,
  selectedCategoryId,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (categoryId: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (categoryId === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", categoryId);
    }

    router.push(`/flat?${newParams.toString()}`);
  };

  const allCategories = [
    { _id: "all", categoryName: "All Flats" },
    ...rentCategories,
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {allCategories.map((category) => {
        const isSelected = selectedCategoryId === category._id;

        return (
          <div key={category._id}>
            <p
              onClick={() => handleSelect(category._id)}
              className={`
                border 
                ${
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-[#262626]/30 text-[#262626]/70 font-medium"
                }
                hover:border-primary hover:text-white hover:bg-primary 
                duration-300 rounded-full px-4 py-2 capitalize  text-sm  cursor-pointer 
                ${poppins.className}
              `}
            >
              {category.categoryName}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default FlatCategory;

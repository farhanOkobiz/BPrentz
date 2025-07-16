"use client";
import { poppins } from "@/app/font";
import RentCard from "@/components/card/RentCard/RentCard";
import { IRent } from "@/types";
import SectionTitle from "@/utilits/SectionTitle";
import Link from "next/link";

interface Props {
  lands: IRent[];
}

const LandSection: React.FC<Props> = ({ lands }) => {
  const publishedLands = lands?.filter(
    (land) => land.publishStatus === "published" && land?.selected === true
  );

  return (
    <div className="Container pt-8">
      <div>
        <SectionTitle
          title="Choose From Our Diverse Range of Lands"
          subTitle="From individual stays to family getaways, our properties cater to all your accommodation needs."
        />
      </div>

      <div className="pt-4">
        {publishedLands?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {publishedLands.map((land) => (
              <RentCard key={land._id} rent={land} linkPrefix="land" />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No published lands available at the moment.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center md:py-8 pt-4 text-[#fff]">
        <Link href="/land">
          <button
            className={`bg-primary md:px-6 px-4 md:py-3 py-2 md:text-base text-sm rounded font-medium cursor-pointer ${poppins.className}`}
          >
            Load more..
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandSection;

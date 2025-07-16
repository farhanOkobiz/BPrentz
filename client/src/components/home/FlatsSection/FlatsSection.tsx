"use client";
import { poppins } from "@/app/font";
import RentCard from "@/components/card/RentCard/RentCard";
import { IRent } from "@/types";
import SectionTitle from "@/utilits/SectionTitle";
import Link from "next/link";
interface Props {
  flats: IRent[];
}

const FlatsSection: React.FC<Props> = ({ flats }) => {

  return (
    <div className="Container pt-8">
      <div>
        <SectionTitle
          title="Choose From Our Diverse Range of Flats"
          subTitle="From individual stays to family getaways, our properties cater to all your accommodation needs."
        />
      </div>

      {/* <div className="mt-8 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-4">
        {flats?.slice(0, 8).map((flat) => (
          <RentCard key={flat._id} rent={flat} linkPrefix="flat"></RentCard>
        ))}
      </div> */}

      <div className="mt-8">
        {flats?.filter((flat: IRent) => flat.publishStatus === "published" && flat?.selected === true).length ===
          0 ? (
          <p className="text-center text-gray-500 lg:py-60 py-20">
            No published flats available at the moment.
          </p>
        ) : (
          <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4">
            {flats
              ?.filter((flat: IRent) => flat.publishStatus === "published" && flat?.selected === true)
              .map((flat: IRent) => (
                <RentCard key={flat._id} rent={flat} linkPrefix="flat" />
              ))}
          </div>
        )}
        {/* {flats?.length === 0 ? (
          <p className="text-center text-gray-500 lg:py-60 py-20">
            No published flats available at the moment.
          </p>
        ) : (
          <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4">
            {flats.slice(0, 8).map((rent: IRent) => (
              <RentCard key={rent._id} rent={rent} linkPrefix="flat" />
            ))}
          </div>
        )} */}
      </div>

      <div className="flex items-center justify-center md:py-8 pt-4 text-[#fff]">
        <Link href="/flat">
          <button
            className={`bg-primary md:px-6 px-4 md:py-3 py-2  md:text-base text-sm rounded font-medium cursor-pointer  ${poppins.className}`}
          >
            Load more..
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FlatsSection;

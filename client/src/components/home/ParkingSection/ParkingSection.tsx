"use client";
import { poppins } from "@/app/font";
import RentCard from "@/components/card/RentCard/RentCard";

import { IRent } from "@/types";
import SectionTitle from "@/utilits/SectionTitle";
import Link from "next/link";

interface Props {
  parkings: IRent[];
}

const ParkingSection: React.FC<Props> = ({ parkings }) => {

  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const timeout = setTimeout(() => setIsLoading(false), 0);
  //   return () => clearTimeout(timeout);
  // }, []);

  return (
    <div className="Container pt-8">
      <div>
        <SectionTitle
          title="Secure Your Parking Spot Today"
          subTitle="From Daily Use to Long-Term Parking—We've Got You Covered."
        />
      </div>

      <div className="mt-8">
        {/* {rents?.slice(0, 8).map((rent) => (
          <RentCard key={rent._id} rent={rent} linkPrefix="rent"></RentCard>
        ))} */}
        {parkings?.filter((rent: IRent) => rent.status === "published" && rent?.selected === true).length ===
          0 ? (
          <p className="text-center text-gray-500 lg:py-60 py-20">
            No published rents available at the moment.
          </p>
        ) : (
          <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 gap-4">
            {parkings
              ?.filter((rent: IRent) => rent.status === "published" && rent?.selected === true)
              .map((rent: IRent) => (
                <RentCard key={rent._id} rent={rent} linkPrefix="rent" />
              ))}
          </div>
        )}

        {/* {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <RentCardSkeleton key={i} />
            ))
          : rents
              ?.slice(0, 8)
              .map((rent) => (
                <RentCard key={rent._id} rent={rent} linkPrefix="rent" />
              ))} */}
      </div>

      <div className="flex items-center justify-center md:py-8 pt-4 text-[#fff]">
        <Link href="/rent">
          <button
            className={`bg-secondary md:px-6 px-4 md:py-3 py-2 rounded md:text-base text-sm font-medium cursor-pointer  ${poppins.className}`}
          >
            Load more..
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ParkingSection;

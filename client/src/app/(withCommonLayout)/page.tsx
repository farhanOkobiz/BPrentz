// export const dynamic = "force-dynamic";
// import dynamic from "next/dynamic";
// import React, { Suspense } from "react";

import Banner from "@/components/home/Banner/Banner";
import SearchContainer from "@/components/home/search/searchContainer/SearchContainer";
import RentSection from "@/components/home/RentSection/RentSection";
import FlatsSection from "@/components/home/FlatsSection/FlatsSection";
import LandSection from "@/components/home/LandSection/LandSection";
import BlogSection from "@/components/blog/blogContainer/BlogSection/BlogSection";
import ChooseSection from "@/components/home/ChooseSection/ChooseSection";

// const BlogSection = dynamic(
//   () => import("@/components/blog/blogContainer/BlogSection/BlogSection")
// );
// const ChooseSection = dynamic(
//   () => import("@/components/home/ChooseSection/ChooseSection")
// );

import { getAllBanners } from "@/services/banners";
import { getAllBlogs } from "@/services/blog";
import { getAllChoose } from "@/services/choose";
import { getAllFlats } from "@/services/flats";
import { getAllLands } from "@/services/land";
import { getAllRents } from "@/services/rents";

const HomePage = async () => {
  const [
    { data: banners },
    { data: rents },
    { data: flats },
    { data: lands },
    { data: blogs },
    { data: chooses },
  ] = await Promise.all([
    getAllBanners(),
    getAllRents({ status: "published" }),
    getAllFlats({ status: "published" }),
    getAllLands({ status: "published" }),
    getAllBlogs(),
    getAllChoose(),
  ]);




  return (
    <div>
      <div className="relative">
        <Banner banners={banners} />
        <div className="w-full xl:px-10 absolute left-1/2 bottom-[-50px] -translate-x-1/2 z-10">
          <SearchContainer />
        </div>
      </div>

      <RentSection rents={rents} />
      <FlatsSection flats={flats} />
      <LandSection lands={lands} />

      {/* <Suspense fallback={<div>Loading blogs...</div>}> */}
      <BlogSection blogs={blogs} />
      {/* </Suspense> */}

      {/* <Suspense fallback={<div>Loading features...</div>}> */}
      <ChooseSection chooses={chooses} />
      {/* </Suspense> */}
    </div>
  );
};

export default HomePage;

"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import React, { useRef } from "react";
import { TBanner } from "@/types";

import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { apiBaseUrl } from "@/config/config";
import { Swiper as SwiperClass } from "swiper";
// import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
interface BannerProps {
  banners: TBanner[];
}

const BannerSlider: React.FC<BannerProps> = ({ banners }) => {
  const swiperRef = useRef<SwiperClass | null>(null);

  return (
    <div className="relative mt-[-2px]">
      <Swiper
        spaceBetween={1}
        slidesPerView={1}
        modules={[Navigation, Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        onSwiper={(swiper) => (swiperRef.current = swiper as SwiperClass)}
        speed={1200}
        loop={true}
      >
        {banners?.map((banner: TBanner) => (
          // <SwiperSlide key={banner._id}>
          //   <div className="2xl:h-[500px] xl:h-[400px] lg:h-[400px] md:h-[280px] h-[220px]  relative">
          //     <Image
          //       src={apiBaseUrl + banner.bannerImage || ""}
          //       alt="Banner"
          //       priority
          //       width={1600}
          //       height={600}
          //       className="w-full h-full"
          //     />
          //   </div>
          // </SwiperSlide>
                    <SwiperSlide key={banner._id}>
            <div className="2xl:h-[500px] xl:h-[400px] lg:h-[400px] md:h-[280px] h-[220px] relative">
              <img
                src={apiBaseUrl + banner.bannerImage || ""}
                alt="Banner"
                width={1600}
                height={600}
                className="w-full h-full"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;

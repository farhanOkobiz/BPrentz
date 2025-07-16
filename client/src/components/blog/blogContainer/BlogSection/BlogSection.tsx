"use client";

import SectionTitle from "@/utilits/SectionTitle";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BlogCard from "../BlogCard";
import { IBlog } from "../../types";
import React from "react";
interface Props {
  blogs: IBlog[];
}
const BlogSection: React.FC<Props> = ({ blogs }) => {
  return (
    <div className="Container mt-20 ">
      <div>
        <SectionTitle
          title="Read Our Recent Blogs"
          subTitle="From individual stays to family getaways, our properties cater to all your accommodation needs."
        />
      </div>
      <div>
        <div className="mt-8">
          {blogs && blogs.length > 0 ? (
            <>
              <Swiper
                modules={[Pagination]}
                spaceBetween={8}
                slidesPerView={1}
                loop={true}
                pagination={{ el: ".custom-pagination2", clickable: true }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 3 },
                  1536: { slidesPerView: 4 },
                }}
              >
                {blogs.map((blog) => (
                  <SwiperSlide key={blog._id} className="py-2 px-1">
                    <BlogCard blog={blog} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="custom-pagination2 flex justify-center gap-2 mt-4"></div>
            </>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              There are no blogs, blogs are coming....
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;

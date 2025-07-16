"use client";
import ImageModel from "@/components/modals/ImageModel";
import VideoModal from "@/components/modals/VideoModal";
import { apiBaseUrl } from "@/config/config";
import Image from "next/image";
import React, { useState } from "react";
import { IoPlay } from "react-icons/io5";
import { TbGridDots } from "react-icons/tb";

interface ImagesGalleryProps {
  images: string[];
  video: string;
}

const ImagesGallery: React.FC<ImagesGalleryProps> = ({ images, video }) => {
  const [openGallery, setOpenGallery] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const isLoading = images?.length === 0;

  return (
    <div>
      <div className="grid lg:grid-cols-2 gap-4 relative cursor-pointer">
        {/* Main large image or skeleton */}
        <div
          onClick={() => !isLoading && setOpenGallery(true)}
          className="w-full xl:h-[430px] lg:h-[350px] md:h-[320px] h-[240px]"
        >
          {/* {isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
          ) : (
            {
              images?.[0] && (
                <Image
              src={apiBaseUrl + images[0]}
              alt="Main Image"
              width={500}
              height={500}
              className="w-full h-full object-cover rounded"
            />
              )
            }
          )} */}

          {isLoading ? (
            <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
          ) : (
            images && (
              <Image
                src={apiBaseUrl + images[0]}
                alt="Main Image"
                width={500}
                height={500}
                className="w-full h-full object-cover rounded"
              />
            )
          )}
        </div>

        {/* Remaining images or skeletons */}
        <div
          onClick={() => !isLoading && setOpenGallery(true)}
          className="lg:grid grid-cols-2 gap-2 hidden"
        >
          {isLoading
            ? Array(4)
                .fill(null)
                .map((_, index) => (
                  <div
                    key={index}
                    className="w-full xl:h-[210px] lg:h-[165px] bg-gray-200 animate-pulse rounded"
                  />
                ))
            : images?.slice(1, 5).map((img, index) => (
                <div key={index} className="w-full xl:h-[210px] lg:h-[165px]">
                  {img && (
                    <Image
                      src={apiBaseUrl + img}
                      alt={`Image ${index + 2}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
              ))}
        </div>

        {/* "Show all photos" button */}

        <div className="flex items-center gap-1 absolute lg:bottom-5 bottom-2 right-2 lg:right-5">
          {video && (
            <div
              onClick={() => setOpenVideo(true)}
              className="lg:px-3 lg:py-[9px] px-1 py-[5px] rounded text-[#FFFFFF] bg-[#FF0033] border border-[#262626]/70"
            >
              <IoPlay className="lg:text-lg text-base" />
            </div>
          )}
          <div
            onClick={() => setOpenGallery(true)}
            className="flex items-center lg:gap-2 gap-1 border border-[#262626]/40 rounded lg:px-2 lg:py-2 p-1  cursor-pointer md:text-sm text-[12px] font-medium   bg-[#fff]"
          >
            <p>
              <TbGridDots />
            </p>
            <p>Show all photos</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className={`w-full h-screen bg-white fixed top-0 left-0 z-50 p-6 overflow-y-auto overflow-x-hidden scrollbar-hide transition-all duration-300 ${
          openGallery
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <ImageModel images={images} setOpenGallery={setOpenGallery} />
      </div>

      <div
        className={`w-full h-full bg-white fixed top-0 left-0 z-50 p-6 overflow-y-auto overflow-x-hidden scrollbar-hide transition-all duration-300 ${
          openVideo
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-4 invisible"
        }`}
      >
        <VideoModal setOpenVideo={setOpenVideo} video={video} />
      </div>
    </div>
  );
};

export default ImagesGallery;

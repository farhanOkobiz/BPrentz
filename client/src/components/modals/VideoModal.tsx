"use client";

import { IoIosArrowBack } from "react-icons/io";
import FlatAndLandVideo from "../details/FlatAndLandVideo/FlatAndLandVideo";

interface Props {
  setOpenVideo: React.Dispatch<React.SetStateAction<boolean>>;
  video: string;
}

const VideoModal: React.FC<Props> = ({ setOpenVideo, video }) => {
  return (
    <div className="">
      {/* Back Button */}
      <div onClick={() => setOpenVideo(false)} className="mb-4 mx-4 mt-8">
        <div className="px-1 py-1 border inline-flex rounded cursor-pointer">
          <IoIosArrowBack className="text-2xl" />
        </div>
      </div>

      {/* Image Content */}
      <div className="flex item-center justify-center">
        {video && <FlatAndLandVideo video={video} />}
      </div>
    </div>
  );
};

export default VideoModal;

import { apiBaseUrl } from "@/config/config";
import React from "react";

interface Props {
  video: string; // assumed to be either a YouTube URL or a relative path
}

const FlatAndLandVideo: React.FC<Props> = ({ video }) => {
  console.log("video== ", video)
  const extractYouTubeId = (url: string): string | null => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const youtubeId = extractYouTubeId(video);

  return (
    <div className="xl:w-3/5 lg:w-4/5 w-full md:h-[50vh] h-[40vh]  mt-20 ">
      {youtubeId ? (
        <iframe
          className="h-full w-full object-cover rounded duration-300"
          title={`YouTube video player`}
          src={`https://www.youtube.com/embed/${youtubeId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video
          className="h-full w-full object-cover rounded duration-300"
          src={apiBaseUrl + video}
          controls
          aria-label="Video player"
        ></video>
      )}
    </div>
  );
};

export default FlatAndLandVideo;

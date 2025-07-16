import { getAboutTextAndVideo } from "@/services/about";
import AboutText from "./AboutText";
import AboutVideo from "./AboutVideo";

const AboutTextAndVideoContainer = async () => {
  const { data: textAndVideoData } = await getAboutTextAndVideo();

  if (!textAndVideoData?.length) return null;

  const about = textAndVideoData[0];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      <AboutText description={about?.description} />
      <AboutVideo videoUrl={about?.videoUrl} />
    </div>
  );
};

export default AboutTextAndVideoContainer;

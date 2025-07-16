import AboutCardContainer from "@/components/about/aboutContainer/AboutCardContainer";
import AboutHeader from "@/components/about/aboutContainer/AboutHeader";
import AboutTextAndVideoContainer from "@/components/about/aboutTextAndVideo/AboutTextAndVideoContainer";
import React from "react";

const about = () => {
  return (
    <div className="Container py-10 md:py-20">
       <AboutHeader/>
       <AboutCardContainer/>
       <AboutTextAndVideoContainer/>

    </div>
  );
};

export default about;

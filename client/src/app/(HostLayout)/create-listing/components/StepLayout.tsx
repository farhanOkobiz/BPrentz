import React from "react";
import { Steps } from "antd";
import { SmileOutlined, CameraOutlined, RocketOutlined } from "@ant-design/icons";

const StepLayout: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-8 p-4 md:p-12 items-center justify-center">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center lg:pr-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 leading-tight">
          It&apos;s easy to get started on <span className="text-primary">Homzystay</span>
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Just follow a few simple steps and your place will be ready to host
          guests in no time.
        </p>
        
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-blue-800">
            <span className="font-semibold">Pro tip:</span> Complete your profile first to increase trust with guests!
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex flex-col justify-center lg:pl-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
            Prepare to Welcome Guests
          </h2>
          <p className="text-gray-500 text-base">
            A quick overview of how to publish your Homzystay listing.
          </p>
        </div>

        <Steps
          progressDot
          current={1}
          direction="vertical"
          className="custom-steps"
          items={[
            {
              title: <span className="font-semibold text-lg text-gray-800">Tell us about your place</span>,
              description: (
                <p className="text-gray-600 mt-1 pl-6">
                  Share some basic info, like where it is and how many guests can stay.
                </p>
              ),
              icon: <SmileOutlined className="text-blue-500 text-lg" />,
            },
            {
              title: <span className="font-semibold text-lg text-gray-800">Make it stand out</span>,
              description: (
                <p className="text-gray-600 mt-1 pl-6">
                  Add 5 or more photos plus a title and description—we&apos;ll help you out.
                </p>
              ),
              icon: <CameraOutlined className="text-blue-500 text-lg" />,
            },
            {
              title: <span className="font-semibold text-lg text-gray-800">Finish up and publish</span>,
              description: (
                <p className="text-gray-600 mt-1 pl-6">
                  Choose if you&apos;d like to start with an experienced guest, set a starting price, and publish your listing.
                </p>
              ),
              icon: <RocketOutlined className="text-blue-500 text-lg" />,
            },
          ]}
        />
        
        <div className="mt-12 p-4 bg-[#da653e] text-white rounded-lg text-center">
          <p className="font-semibold cursor-pointer">Need help? Our support team is available 24/7!</p>
        </div>
      </div>
    </div>
  );
};

export default StepLayout;
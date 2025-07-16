import React from "react";
import { CgCheck } from "react-icons/cg";

interface Props {
  allowableThings: string[];
  cancellationPolicy: string[];
  houseRules: string[];
}
const RulesRent: React.FC<Props> = ({
  allowableThings,

  houseRules,
}) => {
  console.log("allowableThings", allowableThings);
  console.log("houseRules", houseRules);
  return (
    <div className="">
      <h2 className="text-2xl font-medium">Need to know</h2>

      <div className="py-6 md:px-20 px-4 bg-[#FBFCFC] border border-[#262626]/10 rounded mt-6 grid lg:grid-cols-3">
        <div className="">
          <h2 className="md:text-xl text-lg font-medium">House rules</h2>
          <ul className="flex flex-col gap-2 mt-4">
            {houseRules?.length > 0
              ? houseRules?.map((rule, idx) => (
                  <li
                    key={idx}
                    className="flex items-baseline gap-2 text-[#262626]/70"
                  >
                    <span className="rounded-full bg-primary text-[#fff]">
                      <CgCheck />
                    </span>
                    <span className="text-base">{rule}</span>
                  </li>
                ))
              : "No house rules set"}
          </ul>
        </div>
        <div className="flex flex-col gap-2 mt-4 lg:ml-[-20px]">
          <h2 className="md:text-xl text-lg mb:pb-0 pb-2 font-medium">
            Allowable things
          </h2>
          {allowableThings?.length > 0
            ? allowableThings?.map((allow, idx) => (
                <li
                  key={idx}
                  className="flex items-baseline gap-2 text-[#262626]/70"
                >
                  <span className="rounded-full bg-primary text-[#fff]">
                    <CgCheck />
                  </span>
                  <span className="text-base">{allow}</span>
                </li>
              ))
            : "No allowable things set"}
        </div>
        <div>
          <h2 className="md:text-xl text-lg mb:pt-0 pt-4 font-medium">
            Cancellation policy
          </h2>
          <ul className="flex flex-col gap-2 mt-4">
            {["No refund or cancellation after booking"].map((rule, idx) => (
              <li
                key={idx}
                className="flex items-baseline gap-2 text-[#262626]/70"
              >
                <span className="rounded-full bg-primary text-[#fff]">
                  <CgCheck />
                </span>
                <span className="text-base">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RulesRent;

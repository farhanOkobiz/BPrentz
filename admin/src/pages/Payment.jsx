import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";

const Payment = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="bg-white shadow-md rounded-2xl p-8 text-center max-w-md w-full border border-gray-100">
        <AiOutlineClockCircle
          size={64}
          className="text-yellow-500 mb-4 mx-auto"
        />
        <h2 className="text-3xl font-bold mb-2 text-gray-800">Coming Soon</h2>
        <p className="text-gray-500">
          We're working hard to launch this page. Please check back later!
        </p>
      </div>
    </div>
  );
};

export default Payment;

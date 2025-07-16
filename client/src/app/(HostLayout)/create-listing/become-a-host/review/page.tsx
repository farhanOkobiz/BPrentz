"use client";

import { CheckCircle } from "lucide-react";

export default function ReviewMainPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center space-y-6">
      <CheckCircle className="text-green-500 w-16 h-16" />

      <h1 className="text-3xl font-semibold text-gray-800">ধন্যবাদ!</h1>

      <p className="text-gray-600 max-w-md">
        Homzstay-এর পক্ষ থেকে আপনাকে আন্তরিক ধন্যবাদ জানাচ্ছি। আমাদের প্রতিনিধি
        খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।
      </p>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4 text-gray-700 text-sm">
        <span className="font-medium">নোট:</span> আপনার দেওয়া তথ্য আমরা রিভিউ
        করছি। <br />
        Homzstay-এর একজন প্রতিনিধি আপনাকে কল করবেন অতি শীঘ্রই।
      </div>
    </div>
  );
}

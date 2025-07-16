import BlogTabs from "@/components/blog/blogContainer/BlogTabs";
import { getFeatures } from "@/services/blog";
import React from "react";

const page = async () => {
  const { data: features } = await getFeatures();
  return (
    <div className="Container py-4">
      <BlogTabs features={features} />
    </div>
  );
};

export default page;

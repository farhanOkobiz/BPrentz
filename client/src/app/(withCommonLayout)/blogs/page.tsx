"use server";
import BlogTabs from "@/components/blog/blogContainer/BlogTabs";
import { getFeatures } from "@/services/blog";
import { Feature } from "@/types/blogTypes/blogTypes";

const BlogMainContainer = async () => {
  const { data: features }: { data: Feature[] } = await getFeatures();

  return (
    <div className="Container py-4">
      <BlogTabs features={features} />
    </div>
  );
};

export default BlogMainContainer;

import { BlogData } from "@/types/blogTypes/blogTypes";
import BlogCard from "./BlogCard";

interface BlogListProps {
  blogs: BlogData[];
}

const BlogList = ({ blogs }: BlogListProps) => {
  if (!blogs?.length) {
    return <p className="text-gray-500">No blogs found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogList;

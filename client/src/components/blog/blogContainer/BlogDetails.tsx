import { formatDate } from "../util/DateTimeFormate";
import { IBlog } from "../types";
import { apiBaseUrl } from "@/config/config";
import Image from "next/image";

interface BlogDetailsProps {
  data: IBlog;
}

const BlogDetails: React.FC<BlogDetailsProps> = ({ data }) => {
  if (!data) return null;

  console.log("blog details", data);

  return (
    <div className="max-w-6xl mx-auto  py-10 px-3 md:px-6 ">
      <div className="relative overflow-hidden rounded shadow-sm mb-6 p-2">
        {/* <img
          src={`${apiBaseUrl}${data.blogImage}` ?? ""}
          alt={data.blogTitle}
          className="w-full h-[70vh] object-cover"
        /> */}
        {data.blogImage && (
          <Image
            src={`${apiBaseUrl}${data.blogImage}`}
            alt={data.blogTitle}
            width={700}
            height={700}
            priority
            className="w-full rounded"
          />
        )}
      </div>

      <div className="px-4">
        <h1 className="md:text-2xl text-xl font-semibold text-gray-900 mb-2">
          {data.blogTitle}
        </h1>

        <div className="text-sm text-gray-500 mb-2">
          Published on {formatDate(data.createdAt)}
        </div>

        <article
          className="mt-2 text-[#262626]/80"
          dangerouslySetInnerHTML={{ __html: data.blogDescription }}
        />
      </div>
    </div>
  );
};

export default BlogDetails;

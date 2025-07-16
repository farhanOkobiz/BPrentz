import { apiBaseUrl } from "@/config/config";
import { formatDate } from "../util/DateTimeFormate";
import Link from "next/link";
import Image from "next/image";
import { CiCalendarDate } from "react-icons/ci";
import { BsArrowRight } from "react-icons/bs";
import { poppins } from "@/app/font";
import { IBlog } from "../types";
import React from "react";

interface Props {
  blog: IBlog;
}

const BlogCard: React.FC<Props> = ({ blog }) => {
  return (
    <Link href={`/blogs/${blog?.slug}`} className="block">
      <div className="rounded cursor-pointer border-0 overflow-hidden group shadow-sm hover:shadow-md transition duration-300">
        <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative overflow-hidden">
          {blog?.blogImage && (
            <Image
              src={`${apiBaseUrl}${blog?.blogImage}`}
              alt={blog.blogTitle}
              width={300}
              height={300}
              priority
              className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gray-400 bg-opacity-40 opacity-20 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none"></div>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center gap-1">
            <span className="bg-[#FDEEE9] p-1 rounded text-primary">
              <CiCalendarDate />
            </span>
            <time className="text-sm"> {formatDate(blog.createdAt)}</time>
          </div>

          <h2 className="text-base font-semibold mt-2">{blog.blogTitle}</h2>

          <p
            className="line-clamp-2 mt-2 text-[#262626]/70"
            dangerouslySetInnerHTML={{ __html: blog.blogDescription }}
          ></p>
          <div className="mt-3">
            <span className="flex items-center group-hover:text-primary duration-300 gap-1 uppercase text-sm font-medium tracking-wider">
              <span
                className={`relative z-10 transition-colors duration-300 ${poppins.className}`}
              >
                Read more
              </span>
              <BsArrowRight className="group-hover:ml-2 duration-300" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;

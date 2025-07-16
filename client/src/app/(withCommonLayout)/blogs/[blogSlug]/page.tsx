"use server";
import BlogDetails from "@/components/blog/blogContainer/BlogDetails";
import { getSingleBlogBySlug } from "@/services/blog";
import { IBlog } from "@/components/blog/types";
import React, { Fragment } from "react";

interface PageProps {
  params: Promise<{
    blogSlug: string;
  }>;
}

const BlogDetailsContainer: React.FC<PageProps> = async ({ params }) => {
  const resolvedParams = await params;
  const { data: blogsDetailsData }: { data: IBlog } = await getSingleBlogBySlug(
    resolvedParams.blogSlug
  );

  console.log("blog details", blogsDetailsData);

  return (
    <Fragment>
      <BlogDetails data={blogsDetailsData} />
    </Fragment>
  );
};

export default BlogDetailsContainer;

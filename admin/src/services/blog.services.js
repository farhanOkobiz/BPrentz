import BlogApis from "../apis/blog.apis";

const {
  getBlogsApi,
  getBlogByIdApi,
  addBlogApi,
  editBlogApi,
  deleteBlogApi,
  editBlogFieldApi,
} = BlogApis;

const BlogServices = {
  processGetBlogs: async () => {
    try {
      const response = await getBlogsApi();
      return response?.data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processGetBlogs");
      }
    }
  },

  processGetBlogById: async (id) => {
    try {
      const response = await getBlogByIdApi(id);
      return response?.data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processGetBlogById");
      }
    }
  },

  processAddBlog: async (payload) => {
    try {
      const response = await addBlogApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processAddBlog");
      }
    }
  },

  processEditBlog: async (id, payload) => {
    try {
      const response = await editBlogApi(id, payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processEditBlog");
      }
    }
  },
  processEditBlogField: async (id, payload) => {
    try {
      console.log("processEditBlogField", payload);
      const response = await editBlogFieldApi(id, payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processEditBlog");
      }
    }
  },
  processDeleteBlog: async (id) => {
    try {
      const response = await deleteBlogApi(id);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processDeleteBlog");
      }
    }
  },
};

export default BlogServices;

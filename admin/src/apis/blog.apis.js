import axiosClient from "../configs/axios.config";

const BlogApis = {
  getBlogsApi: () => {
    return axiosClient.get("/blog");
  },
  getBlogByIdApi: (id) => {
    return axiosClient.get(`/blog/${id}`);
  },
  addBlogApi: (payload) => {
    return axiosClient.post("/blog", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  editBlogApi: (id, payload) => {
    return axiosClient.put(`/blog/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  editBlogFieldApi: (id, payload) => {
    console.log("editBlogFieldApi", payload);
    return axiosClient.patch(`/blog/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteBlogApi: (id) => {
    return axiosClient.delete(`/blog/${id}`);
  },
};

export default BlogApis;

import axiosClient from "../configs/axios.config";

const FaqApis = {
  getFaqApi: () => {
    return axiosClient.get("/admin/faq");
  },
  addFaqApi: (payload) => {
    return axiosClient.post("/admin/faq", payload);
  },
  editFaqApi: (payload, id) => {
    return axiosClient.put(`/admin/faq/${id}`, payload);
  },
  deleteFaqApi: (id) => {
    return axiosClient.delete(`/admin/faq/${id}`);
  },
};

export default FaqApis;

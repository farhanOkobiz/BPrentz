import axiosClient from "../configs/axios.config";

const featureApis = {
  getFeaturesApi: () => {
    return axiosClient.get("/admin/feature");
  },
  addFeatureApi: (payload) => {
    return axiosClient.post("/admin/feature", payload);
  },
  editFeatureApi: (payload, id) => {
    return axiosClient.put(`/admin/feature/${id}`, payload);
  },
  deleteFeatureApi: (id) => {
    return axiosClient.delete(`/admin/feature/${id}`);
  },
};

export default featureApis;

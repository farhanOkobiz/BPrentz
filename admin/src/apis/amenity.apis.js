import axiosClient from "../configs/axios.config";
const AmenitiesApis = {
  getAmenitiesApi: () => {
    return axiosClient.get("/admin/amenities");
  },
  addAmenitiesApi: (payload) => {
    return axiosClient.post("/admin/amenities", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  editAmenitiesApi: (id, payload) => {
    return axiosClient.put(`/admin/amenities/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  editAmenitiesFieldApi: (id, payload) => {
    return axiosClient.patch(`/admin/amenities/${id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteAmenitiesApi: (id) => {
    return axiosClient.delete(`/admin/amenities/${id}`);
  },
};

export default AmenitiesApis;

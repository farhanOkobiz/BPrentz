import axiosClient from "../configs/axios.config";

const LandApis = {
  findAllLands: ({ page, status, sort, search, isSold }) => {
    const params = new URLSearchParams();

    if (page !== undefined) params.append("page", String(page));
    if (status) params.append("publishStatus", status);
    if (typeof isSold === "boolean") params.append("isSold", String(isSold));
    if (search) params.append("search", search);
    if (sort) params.append("sort", sort);

    return axiosClient.get(`/land?${params.toString()}`);
  },
  changeStatus: ({ id, payload }) => {
    return axiosClient.patch(`/admin/land/${id}`, payload);
  },
  deleteOne: ({ id }) => {
    return axiosClient.delete(`/admin/land/${id}`);
  },
   selectLandApi: ({ id, payload }) => {
  return axiosClient.patch(`/admin/land/${id}/select`, payload);
}
};

export default LandApis;

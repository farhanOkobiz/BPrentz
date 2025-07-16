import axiosClient from "../configs/axios.config";

const RentApis = {
  findAllRents: ({ page, status, sort, search }) => {
    return axiosClient.get(
      `/rent?page=${page}&status=${status}&sort=${sort}&search=${search}`
    );
  },
  changeStatus: ({ id, payload }) => {
    return axiosClient.patch(`/admin/rent/${id}`, payload);
  },
  deleteOne: ({ id }) => {
    return axiosClient.delete(`/admin/rent/${id}`);
  },
 selectRentApi: ({ id, payload }) => {
  return axiosClient.patch(`/admin/rent/${id}/select`, payload);
}
};

export default RentApis;

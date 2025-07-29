import axiosClient from "../configs/axios.config";

const ParkingApis = {
  findAllParkings: ({ page, status, sort, search }) => {
    return axiosClient.get(
      `/parking?page=${page}&status=${status}&sort=${sort}&search=${search}`
    );
  },
  changeStatus: ({ id, payload }) => {
    return axiosClient.patch(`/admin/parking/${id}`, payload);
  },
  deleteOne: ({ id }) => {
    return axiosClient.delete(`/admin/parking/${id}`);
  },
 selectParkingApi: ({ id, payload }) => {
  return axiosClient.patch(`/admin/parking/${id}/select`, payload);
}
};

export default ParkingApis;

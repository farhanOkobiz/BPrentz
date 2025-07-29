import axiosClient from "../configs/axios.config";

const ParkingApis = {
 
  //
  findAllParkings: ({ page, status,limit, sort, search, isSold }) => {
    return axiosClient.get("/booking/parking", {
      params: { page,limit, status, sort, search, isSold }
    });
  },


 changeStatus: ({ id, payload }) => {
  // /admin/parking/bookings/685010a56ae9052273cb2b9d/status
  return axiosClient.patch(`/admin/parking/bookings/${id}/status`, payload);
},
//
  deleteOne: ({ id }) => {
    return axiosClient.delete(`/admin/parking/bookings/${id}`);
  },
};

export default ParkingApis;


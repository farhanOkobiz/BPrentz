import axiosClient from "../configs/axios.config";

const RentApis = {
 
  //
  findAllRents: ({ page, status,limit, sort, search, isSold }) => {
    return axiosClient.get("/booking/rent", {
      params: { page,limit, status, sort, search, isSold }
    });
  },


 changeStatus: ({ id, payload }) => {
  // /admin/rent/bookings/685010a56ae9052273cb2b9d/status
  return axiosClient.patch(`/admin/rent/bookings/${id}/status`, payload);
},
//
  deleteOne: ({ id }) => {
    return axiosClient.delete(`/admin/rent/bookings/${id}`);
  },
};

export default RentApis;


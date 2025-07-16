


import axiosClient from "../configs/axios.config";

const LandApis = {
 
  
  findAllLands: () => {
    return axiosClient.get("/admin/land/bookings");
  },


 changeStatus: ({ id, payload }) => {
  return axiosClient.patch(`/admin/land/bookings/${id}/status`, payload);
},

  deleteOne: ({ id }) => {
    return axiosClient.delete(`/admin/land/bookings/${id}`);
  },
};

export default LandApis;


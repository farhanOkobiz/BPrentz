import ParkingApis from "../apis/parking.apis";

const { changeStatus, deleteOne, findAllParkings ,selectParkingApi } = ParkingApis;
const ParkingServices = {
  processGetAll: async ({ page, status, sort, search }) => {
    try {
      const data = await findAllParkings({ page, status, sort, search });
      return data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Get Parkings ");
      }
    }
  },
  processChangeStatus: async ({ id, payload }) => {
    try {
      console.log(id, payload);
      const data = await changeStatus({ id, payload });
      return data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Change Status");
      }
    }
  },
  processDeleteOne: async ({ id }) => {
    try {
      const data = await deleteOne({ id });
      return data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Delete One");
      }
    }
  },
    
   processSelectParking: async ({ id, payload }) => {
    try {
      console.log(id, payload);
      const data = await selectParkingApi({ id, payload });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Change Status");
      }
    }
  },
};

export default ParkingServices;

import RentApis from "../apis/rent.apis";

const { changeStatus, deleteOne, findAllRents ,selectRentApi } = RentApis;
const RentServices = {
  processGetAll: async ({ page, status, sort, search }) => {
    try {
      const data = await findAllRents({ page, status, sort, search });
      return data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Get Rents ");
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
    
   processSelectRent: async ({ id, payload }) => {
    try {
      console.log(id, payload);
      const data = await selectRentApi({ id, payload });
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

export default RentServices;

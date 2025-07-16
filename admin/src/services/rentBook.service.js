import RentApis from "../apis/rentBook.apis";



const { changeStatus, deleteOne, findAllRents } = RentApis;
const rentServices = {
  processGetAll: async ({ page,limit, status, sort, search, isSold }) => {
    try {
      const data = await findAllRents({ page,limit, status, sort, search, isSold });
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
};

export default rentServices;

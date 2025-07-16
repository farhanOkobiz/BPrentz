import LandApis from "../apis/landBook.apis";



const { changeStatus, deleteOne, findAllLands } = LandApis;
const landServices = {
  processGetAll: async ({ page, status, sort, search, isSold }) => {
    try {
      const data = await findAllLands({ page, status, sort, search, isSold });
      return data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Get Lands ");
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

export default landServices;

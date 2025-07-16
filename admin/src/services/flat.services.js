import FlatApis from "../apis/flat.apis";

const { changeStatus, deleteOne, findAllFlats ,selectFlattApi } = FlatApis;
const FlatServices = {
  processGetAll: async ({ page, status, sort, search, isSold }) => {
    try {
      const data = await findAllFlats({ page, status, sort, search, isSold });
      return data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Get Flats ");
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
    processSelectFlat: async ({ id, payload }) => {
    try {
      const data = await selectFlattApi({ id, payload });
      if (!data) {
        throw new Error("Failed to update priority");
      }
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

export default FlatServices;

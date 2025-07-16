import AmenitiesApis from "../apis/amenity.apis";

const {
  addAmenitiesApi,
  deleteAmenitiesApi,
  editAmenitiesApi,
  editAmenitiesFieldApi,
  getAmenitiesApi,
} = AmenitiesApis;

const AmenitiesServices = {
  processGetAmenities: async () => {
    try {
      const response = await getAmenitiesApi();
      return response?.data?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processGetAmenities");
      }
    }
  },

  processAddAmenities: async (payload) => {
    try {
      const response = await addAmenitiesApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processAddAmenities");
      }
    }
  },

  processEditAmenities: async (id, payload) => {
    try {
      const response = await editAmenitiesApi(id, payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processEditAmenities");
      }
    }
  },
  processEditAmenitiesField: async (id, payload) => {
    try {
      const response = await editAmenitiesFieldApi(id, payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processEditAmenities");
      }
    }
  },
  processDeleteAmenities: async (id) => {
    try {
      const response = await deleteAmenitiesApi(id);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown error occurred in processDeleteAmenities");
      }
    }
  },
};

export default AmenitiesServices;

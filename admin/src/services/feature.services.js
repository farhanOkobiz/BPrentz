import FeatureApis from "../apis/feature.apis";

const { addFeatureApi, getFeaturesApi, editFeatureApi, deleteFeatureApi } =
  FeatureApis;

const FeatureServices = {
  processGetFeature: async () => {
    try {
      const response = await getFeaturesApi();
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Get Feature ");
      }
    }
  },
  processAddFeature: async (payload) => {
    try {
      const response = await addFeatureApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Add Feature ");
      }
    }
  },
  processEditFeature: async (payload, id) => {
    try {
      const response = await editFeatureApi(payload, id);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Edit Feature ");
      }
    }
  },
  processDeleteFeature: async (id) => {
    try {
      const response = await deleteFeatureApi(id);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Delete Feature ");
      }
    }
  },
};

export default FeatureServices;

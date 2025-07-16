import FaqApis from "../apis/faq.apis";

const { addFaqApi, deleteFaqApi, editFaqApi, getFaqApi } = FaqApis;

const FaqServices = {
  processGetFaq: async () => {
    try {
      const response = await getFaqApi();
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processAddFaq: async (payload) => {
    try {
      const response = await addFaqApi(payload);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processEditFaq: async (payload, id) => {
    try {
      const response = await editFaqApi(payload, id);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processDeleteFaq: async (id) => {
    try {
      const response = await deleteFaqApi(id);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
};

export default FaqServices;

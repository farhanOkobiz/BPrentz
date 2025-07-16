import PartnersApis from "../apis/partners.apis";

const { addPartnerApi, deletePartnerApi, editPartnerApi, getPartnerApi } =
  PartnersApis;

const PartnersServices = {
  processGetPartners: async () => {
    try {
      const response = await getPartnerApi();
      return response?.data?.data;
    } catch (error) {
      throw error;
    }
  },
  processAddPartner: async (payload) => {
    try {
      const response = await addPartnerApi(payload);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processEditPartner: async (id, payload) => {
    try {
      const response = await editPartnerApi(id, payload);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processDeletePartner: async (id) => {
    try {
      const response = await deletePartnerApi(id);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
};

export default PartnersServices;

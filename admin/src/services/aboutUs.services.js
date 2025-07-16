import AboutUsApis from "../apis/aboutUs.apis";

const { addAboutUsApi, getAboutUsApi, editAboutUsApi, deleteAboutUsApi } =
  AboutUsApis;

const AboutUsServices = {
  processGetAboutUs: async () => {
    try {
      const response = await getAboutUsApi();
      return response?.data?.data;
    } catch (error) {
      throw error;
    }
  },
  processAddAboutUs: async (payload) => {
    try {
      const response = await addAboutUsApi(payload);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processEditAboutUs: async (id, payload) => {
    try {
      console.log(id, payload);
      const response = await editAboutUsApi(id, payload);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
  processDeleteAboutUs: async (id) => {
    try {
      const response = await deleteAboutUsApi(id);
      return response?.data;
    } catch (error) {
      throw error;
    }
  },
};

export default AboutUsServices;

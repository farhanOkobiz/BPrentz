import CategoryApis from "../apis/category.apis";

const { addCategoryApi, getCategoryApi, editCategoryApi, deleteCategoryApi } =
  CategoryApis;

const CategoryServices = {
  processGetCategory: async (payload) => {
    try {
      const response = await getCategoryApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Get Category");
      }
    }
  },
  processAddCategory: async (payload) => {
    try {
      const response = await addCategoryApi(payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Add Category");
      }
    }
  },
  processEditCategory: async (id, payload) => {
    try {
      const response = await editCategoryApi(id, payload);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Edit Category");
      }
    }
  },
  processDeleteCategory: async (id) => {
    try {
      const response = await deleteCategoryApi(id);
      return response?.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error("Unknown Error Occurred In Process Delete Category");
      }
    }
  },
};

export default CategoryServices;

import { CategoryResponse } from "@/app/(HostLayout)/components/types/category";
import CategoryApis from "@/app/apis/category.apis";

const {
  getCategoriesByFeatureId,
  updateCategoryForListing,
  updateTitleForListing,
  updateDescriptionForListing,
  updateLocationForListing,
  updateFloorPlanForListing,
  updateHouseAminitiesForListing,
  getSingleStepTitleFieldForRentListing,
  updateListingPriceApi,
  updateLandForListing,
  getSingleStepLandFieldForLandListing,
  getSingleStepLocationFieldForRentListing,
  getSingleDescriptionforlistedItem,
  getAllAmenitiesProcess,
  getAllFeatureResponse,
  updateCheckInDateForRent,
  updateCheckOutDateForRent,
  updateAllowableThingsForListing,
  updateHouseRulesForRentListing,
  updateVideoListing
} = CategoryApis;

const CategoryServices = {
  fetchCategories: async (featureId: string): Promise<CategoryResponse> => {
    const res = await getCategoriesByFeatureId(featureId);
    return res.data;
  },

  fetchLandCategories: async () => {
    const featureRes: any = await getAllFeatureResponse();
    const featureData = featureRes?.data?.data;
    const landFeature = featureData.find(
      (feature: any) => feature.featureName?.toLowerCase().trim() === "land"
    );
    if (!landFeature?._id) throw new Error("Land feature not found");
    const res = await getCategoriesByFeatureId(landFeature._id);
    return res?.data;
  },
  fetchFlatCategories: async () => {
    const featureRes: any = await getAllFeatureResponse();
    const featureData = featureRes?.data?.data;
    const flatFeature = featureData.find(
      (feature: any) => feature.featureName?.toLowerCase().trim() === "flat"
    );
    if (!flatFeature?._id) throw new Error("Land feature not found");
    const res = await getCategoriesByFeatureId(flatFeature._id);
    return res?.data;
  },
  setListingCategory: async ({
    featureType,
    listingId,
    categoryId,
  }: {
    featureType: string;
    listingId: string;
    categoryId: string;
  }) => {
    const res = await updateCategoryForListing(
      featureType,
      listingId,
      categoryId
    );
    return res.data;
  },
  updateListingLandSize: async (
    featureType: string,
    listingId: string,
    landSize: number
  ) => {
    const res = await updateLandForListing(featureType, listingId, landSize);
    return res.data;
  },

  updateListingTitle: async (
    featureType: string,
    listingId: string,
    title: string
  ) => {
    const res = await updateTitleForListing(featureType, listingId, title);
    return res.data;
  },
  ProcessUpdateListingVideo: async (
    featureType: string,
    listingId: string,
    video: string
  ) => {
    const res = await updateVideoListing(featureType, listingId, video);
    return res.data;
  },
  updateListingCheckingRoom: async (
    featureType: string,
    listingId: string,
    checkinDate: Date
  ) => {
    const res = await updateCheckInDateForRent(
      featureType,
      listingId,
      checkinDate
    );
    return res.data;
  },
  updateListingCheckOutRoom: async (
    featureType: string,
    listingId: string,
    checkoutDate: Date
  ) => {
    const res = await updateCheckOutDateForRent(
      featureType,
      listingId,
      checkoutDate
    );
    return res.data;
  },

  getListingTitle: async (featureType: string, listingId: string) => {
    const res = await getSingleStepTitleFieldForRentListing(
      featureType,
      listingId
    );
    return res?.data;
  },
  getListingLocation: async (featureType: string, listingId: string) => {
    const res = await getSingleStepLocationFieldForRentListing(
      featureType,
      listingId
    );
    return res?.data;
  },
  getListingDescription: async (featureType: string, listingId: string) => {
    const res = await getSingleDescriptionforlistedItem(featureType, listingId);
    return res?.data;
  },
  getListingLandSize: async (featureType: string, listingId: string) => {
    const res = await getSingleStepLandFieldForLandListing(
      featureType,
      listingId
    );
    return res?.data;
  },

  updateListingPrice: async (
    featureType: string,
    listingId: string,
    price: number
  ) => {
    const res = await updateListingPriceApi(featureType, listingId, price);
    return res;
  },
  updateListingDescription: async (
    featureType: string,
    listingId: string,
    description: string
  ) => {
    const res = await updateDescriptionForListing(
      featureType,
      listingId,
      description
    );
    return res.data;
  },

  updateListingLocation: async (
    featureType: string,
    listingId: string,
    location: string
  ) => {
    const res = await updateLocationForListing(
      featureType,
      listingId,
      location
    );
    return res.data;
  },

  processUpdateFloorPlan: async (
    featureType: string,
    listingId: string,
    floorPlan: {
      bedroomCount: number;
      bathCount: number;
      bedCount: number;
      guestCount: number;
    }
  ) => {
    const res = await updateFloorPlanForListing(
      featureType,
      listingId,
      floorPlan
    );
    return res.data;
  },
  processAllowableThings: async (
    featureType: string,
    listingId: string,
    allowableThings: string[]
  ) => {
    const res = await updateAllowableThingsForListing(
      featureType,
      listingId,
      allowableThings
    );
    return res.data;
  },
  processHouseRuleSetApi: async (
    featureType: string,
    listingId: string,
    houseRules: string[]
  ) => {
    const res = await updateHouseRulesForRentListing(
      featureType,
      listingId,
      houseRules
    );
    return res.data;
  },

  updateHouseAminities: async (
    featureType: string,
    listingId: string,
    amenities: string[]
  ) => {
    const res = await updateHouseAminitiesForListing(
      featureType,
      listingId,
      amenities
    );
    return res.data;
  },
  getAmenities: async () => {
    const result = await getAllAmenitiesProcess();
    return result?.data;
  },
};

export default CategoryServices;

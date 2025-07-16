// import {
//   CreateListingPayload,
//   FeatureResponse,
// } from "@/app/(hostLayout)/components/types/feature";
// import { ListingResponse } from "@/app/(hostLayout)/components/types/listing";
// import {
//   CreateListingPayload,
//   FeatureResponse,
// } from "@/app/(HostLayout)/components/types/feature";
// import { ListingResponse } from "@/app/(HostLayout)/components/types/listing";

import {
  CreateListingPayload,
  FeatureResponse,
} from "@/app/(HostLayout)/components/types/feature";
import { ListingResponse } from "@/app/(HostLayout)/components/types/listing";
import FeatureApis from "@/app/apis/feature.apis";

const { getAllFeatures, createNewListing } = FeatureApis;

const FeatureServices = {
  fetchFeatures: async (): Promise<FeatureResponse> => {
    const res = await getAllFeatures();
    return res.data;
  },

  createListing: async ({
    featureType,
    featureId,
  }: CreateListingPayload): Promise<ListingResponse> => {
    const res = await createNewListing(featureType, featureId);
    return res?.data;
  },
};

export default FeatureServices;

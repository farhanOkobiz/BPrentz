import axiosClient from "@/lib/axios.config";
import { FeatureResponse } from "../(HostLayout)/components/types/feature";
import { ListingResponse } from "../(HostLayout)/components/types/listing";

const FeatureApis = {
  getAllFeatures: () => axiosClient.get<FeatureResponse>("/admin/feature"),

  createNewListing: (featureType: string, featureId: string) =>
    axiosClient.post<ListingResponse>(`/host/${featureType}/new`, {
      listingFor: [featureId],
    }),
};

export default FeatureApis;

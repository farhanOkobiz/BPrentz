import { Types } from "mongoose";

export enum ParkingListingStatus {
  IN_PROGRESS = "in_progress",
  PENDING = "pending",
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
}

export interface IBlockdate {
  parking?: Types.ObjectId;
  blockDate: Date;
}

export interface IFloorPlan {
  guestCount: number;
  bathCount: number;
  bedCount: number;
  bedroomCount: number;
}

interface IParking {
  latitude?: number;
  longitude?: number;
  selected?: boolean;
  title?: string;
  images?: string[];
  coverImage?: string;
  description?: string;
  floorPlan?: IFloorPlan;
  location?: string;
  price?: number;
  category?: Types.ObjectId;
  listingFor?: Types.ObjectId;
  cancellationPolicy?: string[];
  houseRules?: string[];
  allowableThings?: string[];
  amenities?: Types.ObjectId[];
  status?: ParkingListingStatus;
  host?: Types.ObjectId;
  slug?: string;
  checkinDate?: Date | null;
  checkoutDate?: Date | null;
  adultCount?: number;
  childrenCount?: number;
}
export interface ICreateParkingPayload {
  images?: string[];
  payload?: IParking;
}
export interface IParkingPayload {
  slug?: string;
  payload?: IParking;
  parkingId?: Types.ObjectId;
  listingStatus?: ParkingListingStatus;
  host?: Types.ObjectId;
  images?: string[];
  singleImage?: string;
  coverImageIndex?: number;
  page?: number;
  limit?: number;
}
export interface IParkingImagesPath {
  filename: string;
}

export interface IGetAllParkingRequestedQuery {
  category?: string;
  search?: string;
  status?: string;
  page?: number;
  sort?: 1 | -1;
  userId?: Types.ObjectId;
  role?: string;
  limit?: number;
}

export interface IGetAllParkingQuery {
  category?: string;
  host?: Types.ObjectId;
  status?: string;
  location?: string;
  checkinDate?: string;
  checkoutDate?: string;
  bedroomCount?: number;
  bathCount?: number;
  bedCount?: number;
  guestCount?: number;
  email?: string;
  [key: string]: any;
}

// export interface IGetAllParkingQuery {
//   location?: string;
//   checkinDate?: string;
//   checkoutDate?: string;
//   bedroomCount?: number;
//   bathCount?: number;
//   bedCount?: number;
//   guestCount?: number;
//   email?: string;
//   [key: string]: any;
// }

export interface ICalendar {
  parkingId: Types.ObjectId;

}

export interface IGetAllParkingPayload {
  query: IGetAllParkingQuery;
  page?: number;
  sort?: 1 | -1;
  limit?: number;
  
}


export default IParking;

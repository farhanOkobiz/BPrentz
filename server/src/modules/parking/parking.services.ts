import { join } from 'path';
import IParking, {
  ICreateParkingPayload,
  IGetAllParkingPayload,
  IGetAllParkingQuery,
  IGetAllParkingRequestedQuery,
  IParkingPayload,
} from './parking.interfaces';
import ParkingRepositories from './parking.repositories';
import { promises as fs } from 'fs';
import SlugUtils from '../../utils/slug.utils';

const { generateSlug } = SlugUtils;

const {
  initializedParkingListing,
  creatingParkingListingById,
  processHostListedParkingProperties,
  findAllListedParking,
  deleteListedParkingItem,
  createNewParking,
  findOneListedParking,
  findOneListedParkingById,
  findOneHostListedStepField,
  findAllSearchingParking,
  handleParkingDateBlockList,
  handleGetParkingDateBlockList,
  setParkingSelected
} = ParkingRepositories;
const ParkingServices = {
  processInitializeParkingListing: async ({ host, payload }: IParkingPayload) => {
    try {
      const data = await initializedParkingListing({ host, payload });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In initialize parking listing service');
      }
    }
  },
  processProgressParkingListing: async ({ parkingId, payload }: IParkingPayload) => {
    try {
      const { title } = payload as IParking;
      if (title) (payload as IParking).slug = generateSlug(title);
      const data = await creatingParkingListingById({ payload, parkingId });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In initialize parking listing service');
      }
    }
  },
  processCreateParking: async ({ images, payload }: ICreateParkingPayload) => {
    try {
      const {
        allowableThings,
        amenities,
        cancellationPolicy,
        category,
        floorPlan,
        description,
        host,
        houseRules,
        listingFor,
        price,
        location,
        title,
      } = payload as IParking;
      const uploadedImages = images?.map((item) => `/public/${item}`) as string[];
      const slug = generateSlug(title as string);
      const postPayload: IParking = {
        slug,
        images: uploadedImages,
        coverImage: uploadedImages[0],
        allowableThings,
        amenities,
        cancellationPolicy,
        category,
        floorPlan,
        description,
        host,
        houseRules,
        listingFor,
        price,
        location,
        title,
      };
      const data = await createNewParking(postPayload);
      return data;
    } catch (error) {
      const filePaths = images?.map((item) => join(__dirname, '../../../public', item));
      filePaths?.map((item) => fs.unlink(item));
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In parking listing image upload service');
      }
    }
  },
  processUploadImage: async ({ images, parkingId }: IParkingPayload) => {
    try {
      const uploadedImages = images?.map((item) => `/public/${item}`) as string[];
      const payload: IParking = {
        images: uploadedImages,
        coverImage: uploadedImages[0],
      };
      const data = await creatingParkingListingById({ payload, parkingId });
      return data;
    } catch (error) {
      const filePaths = images?.map((item) => join(__dirname, '../../../public', item));
      filePaths?.map((item) => fs.unlink(item));
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In parking listing image upload service');
      }
    }
  },
  processUnlinkImage: async ({ singleImage, images, parkingId }: IParkingPayload) => {
    const image = singleImage as String;
    const relativeImagePath = image.replace('/public/', '');
    const filePath = join(__dirname, '../../../public', relativeImagePath);
    try {
      const payload: IParking = {};
      if (images) {
        payload.coverImage = images[0];
        payload.images = images;
      }
      await Promise.all([fs.unlink(filePath), creatingParkingListingById({ payload, parkingId })]);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In unlink parking listing image service');
      }
    }
  },
  processHostListedParkingProperties: async ({ host, page, limit }: IParkingPayload) => {
    try {
      return await processHostListedParkingProperties({ host, page, limit });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In unlink parking listing image service');
      }
    }
  },

    handleParkingDateBlockList: async ({ host, payload }: { host: string, payload: any }) => {
    try {
      return await handleParkingDateBlockList({ host, payload });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In unlink parking listing image service');
      }
    }
  },

  handleGetParkingDateBlockList: async ({ payload }: {  payload: any }) => {
    try {
      return await handleGetParkingDateBlockList({ payload });
    }
    catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In unlink parking listing image service');
      }
    }
  },
  processRetrieveOneListedParking: async ({ slug }: IParkingPayload) => {
    try {
      return await findOneListedParking({ slug });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Retrieve One Listed Parking Service');
      }
    }
  },
  processRetrieveOneListedParkingById: async ({ parkingId }: IParkingPayload) => {
    try {
      return await findOneListedParkingById({ parkingId });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Retrieve One Listed Parking Service');
      }
    }
  },
  processChangeStatus: async ({ parkingId, payload }: IParkingPayload) => {
    try {
      const data = await creatingParkingListingById({ payload, parkingId });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In change status service');
      }
    }
  },
  processGetAllListedParking: async ({
    page,
    status,
    sort,
    search,
    category,
    userId,
    role,
  }: IGetAllParkingRequestedQuery) => {
    try {
      const query: IGetAllParkingQuery = {};
      if (status) query.status = String(status);
      if (search) query.email = String(search);
      if (category) query.category = String(category);
      const payload: IGetAllParkingPayload = { query };
      if (page) payload.page = page;
      if (sort) payload.sort = sort;
      if (role === 'host') {
        if (userId) query.host = userId;
      }
      return await findAllListedParking(payload);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred get all listed parking service');
      }
    }
  },
  processDeleteListedParkingItem: async ({ parkingId }: IParkingPayload) => {
    try {
      const { images } = (await deleteListedParkingItem({ parkingId })) as IParking;
      if (images !== null) {
        const relativeImagePath = images?.map((item) => item.replace('/public/', ''));
        const filePaths = relativeImagePath?.map((item) =>
          join(__dirname, '../../../public', item)
        );
        await Promise.all([filePaths?.map((item) => fs.unlink(item))]);
        return;
      }
      return;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In delete listed parking item service');
      }
    }
  },
  processGetParkingField: async ({ id, field }: { id: string; field: string }) => {
    try {
      const data = await findOneHostListedStepField({ id, field });
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Retrieve One Listed Parking Service');
      }

    }
    
  },
  searchParkingListings: async ({
    payload,
    page,
    limit,
    sort,
  }: { payload: any; page?: number; sort?: string, limit?: number }) => {
    console.log('searchParkingListings', payload, page, sort, limit);
    let parsedSort: 1 | -1 | undefined;
    if (sort === '1') parsedSort = 1;
    else if (sort === '-1') parsedSort = -1;
    else parsedSort = undefined;
    const result = await findAllSearchingParking({ query: payload, page, sort: parsedSort, limit});
    return result;
  },
   processSetParkingSelected : async ({ id, selected }: { id: string, selected: boolean }) => {
  try {
    const data= await ParkingRepositories.setParkingSelected({ id, selected });
    return data;
  } catch (error) {
    if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Retrieve One Listed Parking Service');
      }
  }
}

};

export default ParkingServices;

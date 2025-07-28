import mongoose, { Types } from 'mongoose';
import { documentPerPage } from '../../const';
import User from '../user/user.model';
import IParking, { IGetAllParkingPayload, IParkingPayload, ParkingListingStatus } from './parking.interfaces';
import Parking from './parking.models';
import Blockdate from './blockDate.models';
import ParkingBooking from '../parkingBooking/parkingbooking.models';

const ParkingRepositories = {
  initializedParkingListing: async ({ host, payload }: IParkingPayload) => {
    try {
      const { listingFor } = payload as IParking;
      const data = new Parking({ host, listingFor });
      await data.save();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Parking Initialized Operation');
      }
    }
  },
  creatingParkingListingById: async ({ payload, parkingId }: IParkingPayload) => {
    try {
      const parking = await Parking.findById(parkingId);
      const { price } = payload as IParking;
      if (!price) {
        const data = await Parking.findByIdAndUpdate(parkingId, payload, {
          new: true,
          runValidators: true,
        });
        return data;
      } else {
        if (
          parking?.status === ParkingListingStatus.PUBLISHED ||
          parking?.status === ParkingListingStatus.PENDING
        ) {
          const data = await Parking.findByIdAndUpdate(
            parkingId,
            {
              $set: {
                price,
              },
            },
            {
              new: true,
              runValidators: true,
            }
          );
          return data;
        }
        const data = await Parking.findByIdAndUpdate(
          parkingId,
          {
            $set: {
              price,
              status: ParkingListingStatus.PENDING,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        );
        return data;
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Parking Update Operation');
      }
    }
  },
  findOneWithHostAndParkingId: async ({ host, parkingId }: IParkingPayload) => {
    try {
      const data = await Parking.findOne({ host, _id: parkingId });
      if (!data) return null;
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get One Parking Properties Operation');
      }
    }
  },
  findOneListedParking: async ({ slug }: IParkingPayload) => {
    try {
      return await Parking.findOne({ slug })
        .populate('host')
        .populate('listingFor')
        .populate('category')
        .populate('amenities');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find One Listed Parking Operation');
      }
    }
  },
  findOneListedParkingById: async ({ parkingId }: IParkingPayload) => {
    try {
      return await Parking.findOne({ parkingId })
        .populate('host')
        .populate('listingFor')
        .populate('category')
        .populate('amenities');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Find One Listed Parking Operation');
      }
    }
  },
  processHostListedParkingProperties: async ({ host, page, limit }: IParkingPayload) => {
    try {
      const PerPage = limit ?? documentPerPage;
      const currentPage = page ?? 1;
      const skip = (currentPage - 1) * (limit ?? PerPage);
      const [data, total] = await Promise.all([
        Parking.find({ host })
          .skip(skip)
          .limit(PerPage)
          .sort({ createdAt: -1 })
          .populate('host')
          .populate('listingFor')
          .populate('category')
          .populate('amenities'),
        Parking.countDocuments({ host }),
      ]);
      return { data, total };
      // const data = await Parking.find({ host });
      // if (!data) return null;
      // return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get Parking Properties For Host Operation');
      }
    }
  },
  createNewParking: async (payload: IParking) => {
    try {
      const newParking = new Parking(payload);
      await newParking.save();
      return newParking;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Parking Creation Operation');
      }
    }
  },
  findAllListedParking: async ({ query, page, sort }: IGetAllParkingPayload) => {
    try {
      const currentPage = page ?? 1;
      const skip = (currentPage - 1) * documentPerPage;
      // const sortOption: Record<string, 1 | -1> | undefined =
      //   sort === 1 || sort === -1 ? { createdAt: sort } : undefined;
      const sortValue = Number(sort);
      const sortOption: Record<string, 1 | -1> =
        sortValue === 1 || sortValue === -1
          ? { createdAt: sortValue as 1 | -1 }
          : { createdAt: -1 };
      if (query.email) {
        const host = await User.findOne({ email: query.email });
        if (host) {
          query.host = host._id as Types.ObjectId;
          delete query.email;
        } else {
          return { data: [], total: 0 };
        }
      }
      const [data, total] = await Promise.all([
        Parking.find(query)
          .skip(skip)
          .limit(documentPerPage)
          .sort(sortOption)
          .populate('host')
          .populate('listingFor')
          .populate('category')
          .populate('amenities'),
        Parking.countDocuments(query),
      ]);
      return { data, total };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get All Listed Parking Operation');
      }
    }
  },
  deleteListedParkingItem: async ({ parkingId }: IParkingPayload) => {
    try {
      const data = await Parking.findByIdAndDelete(parkingId);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In delete listed parking item Operation');
      }
    }
  },
  findOneHostListedStepField: async ({ id, field }: { id: string, field: string }) => {
    try {
      const data = await Parking.findById(id).lean();

      if (!data) {
        throw new Error('Parking listing data not found');
      }

      if (!(field in data)) {
        throw new Error(`Field "${field}" does not exist in parking document`);
      }

      return data

    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In delete listed parking item Operation');
      }

    }
  },
  findAllSearchingParking: async ({ query, page, sort, limit }: IGetAllParkingPayload) => {
    console.log('findAllSearchingParking ----------------', query, page, sort, limit);
    try {
      const {
        location,
        checkinDate,
        checkoutDate,
        bedroomCount,
        bathCount,
        bedCount,
        guestCount,
        status,
        category,
      } = query;

      const PerPage = limit ?? documentPerPage;
      const currentPage = page ?? 1;
      // const sortOption: Record<string, 1 | -1> | undefined =
      //   sort === 1 || sort === -1 ? { createdAt: sort } : undefined;
      const sortValue = Number(sort);
      const sortOption: Record<string, 1 | -1> =
        sortValue === 1 || sortValue === -1
          ? { createdAt: sortValue as 1 | -1 }
          : { createdAt: -1 };

      // Build the MongoDB query
      const mongoQuery: any = {};
      if (status && status !== "") {
        mongoQuery.status = status;
      }

      if (location) {
        mongoQuery.location = { $regex: location, $options: 'i' };
      }

      if (checkinDate && checkoutDate) {
        mongoQuery.checkinDate = { $lte: new Date(checkinDate) };
        mongoQuery.checkoutDate = { $gte: new Date(checkoutDate) };
      }


      if (bedroomCount) mongoQuery['floorPlan.bedroomCount'] = { $gte: +bedroomCount };
      if (bathCount) mongoQuery['floorPlan.bathCount'] = { $gte: +bathCount };
      if (bedCount) mongoQuery['floorPlan.bedCount'] = { $gte: +bedCount };
      if (guestCount) mongoQuery['floorPlan.guestCount'] = { $gte: +guestCount };
      if (category) {
        mongoQuery.category = category;
      }
      console.log("sortOption", sortOption);
      const allParkings = await Parking.find(mongoQuery)
        .sort(sortOption)
        .populate('host')
        .populate('listingFor')
        .populate('category')
        .populate('amenities');

      // Filter by booking conflicts (if checkin/checkout given)
      // const availableParkings: any[] = [];
      // for (const parking of allParkings) {
      //   const bookingExists = await ParkingBooking.findOne({
      //     parking: parking._id,
      //     ...(checkoutDate && { checkinDate: { $lte: new Date(checkoutDate) } }),
      //     ...(checkinDate && { checkoutDate: { $gte: new Date(checkinDate) } }),
      //     status: { $nin: ['cancelled', 'rejected'] },
      //   });

      //   if (!bookingExists) {
      //     availableParkings.push(parking);
      //   }
      // }

      const total = allParkings.length;
      const paginated = allParkings.slice((currentPage - 1) * PerPage, currentPage * PerPage);

      return {
        data: paginated,
        total,
        totalPages: Math.ceil(total / PerPage),
      };
    } catch (error) {
      throw new Error('Error occurred while searching parking listings');
    }
  },

  handleParkingDateBlockList: async ({ host, payload }: { host: string, payload: any }) => {
    try {
      const { parkingId, date } = payload;
      console.log('handleParkingDateBlockList', { host, parkingId, date });
      const parking = await Parking.findOne({ _id: parkingId, host });
      if (!parking) {
        throw new Error('Parking not found or you do not have permission to block dates for this parking');
      }
      // Check if this date is already booked in ParkingBooking
      const bookingExists = await ParkingBooking.findOne({
        parking: parking._id,
        checkinDate: { $lte: new Date(date) },
        checkoutDate: { $gte: new Date(date) },
        status: { $nin: ['cancelled', 'rejected'] }, // Only consider active bookings
      });

      if (bookingExists) {
        throw new Error('This date is already booked and cannot be blocked.');
      }
      // If only a single date is provided, block/unblock that date
      const blockDate = new Date(date);

      // Check if the block date already exists
      const existing = await Blockdate.findOne({
        parking: parking._id,
        blockDate: blockDate
      });

      if (existing) {
        // If already blocked, remove (unblock) it
        await Blockdate.deleteOne({ _id: existing._id });
        return { message: 'Date unblocked successfully', date: blockDate };
      }

      // Create the block date
      const createdBlockDate = await Blockdate.create({
        parking: parking._id,
        blockDate: blockDate
      });

      return createdBlockDate;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Parking Date Block List Operation');
      }
    }
  },

  handleGetParkingDateBlockList: async ({ payload }: { payload: any }) => {
    try {
      const { parkingId } = payload;
      let filter: any = {};
      if (parkingId) {
        filter.parking = parkingId;
      }
      const blockDates = await Blockdate.find(filter).sort({ blockDate: 1 });

      return blockDates;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get parking Date Block List Operation');
      }
    }
  },
  setParkingSelected: async ({ id, selected }: { id: string, selected: boolean }) => {
    try {
      // Count currently selected items
      const selectedCount = await Parking.countDocuments({ selected: true });
      if (selected && selectedCount >= 9) {
        throw new Error('You can select a maximum of 9 items.');
      }
      const updated = await Parking.findByIdAndUpdate(
        id,
        { selected },
        { new: true }
      );
      return updated;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown Error Occurred In Get Parking List select Operation');
      }
    }
  },


};

export default ParkingRepositories;

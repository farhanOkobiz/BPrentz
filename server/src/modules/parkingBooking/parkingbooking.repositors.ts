import Parking from '../parking/parking.models';
import { IParkingBooking } from './parkingbooking.interfaces';
import ParkingBooking from './parkingbooking.models';


const ParkingBookingRepository = {
  createBooking: async (payload: IParkingBooking) => {
    try {
      // Validate required fields

      const { parking, checkinDate, checkoutDate, guestCount, user } = payload;
      console.log("payload in createBooking:", payload); // Debugging line to check payload
      if (!parking || !checkinDate || !checkoutDate || !guestCount || !user) {
        throw new Error('Missing required fields for parking booking.');
      }
      // chekc if parking is valid data in parking collection
      const parkingExists = await Parking.findById(parking);
      if (!parkingExists) {
        throw new Error('Parking does not exist.');
      }
      const existingBooking = await ParkingBooking.findOne({
        parking: payload.parking,
        $or: [
          { checkinDate: { $lte: payload.checkoutDate, $gte: payload.checkinDate } },
          { checkoutDate: { $gte: payload.checkinDate, $lte: payload.checkoutDate } },
        ],
      });
      if (existingBooking) {
        throw new Error('Parking is not available for the selected dates.');
      }
      // price calculation
      if (typeof parkingExists.price !== 'number') {
        throw new Error('Parking price is not defined.');
      }
      // checkin and checkout date difference count 
      const checkin = new Date(checkinDate);
      const checkout = new Date(checkoutDate);
      if (checkout <= checkin) {
        throw new Error('Checkout date must be after checkin date.');
      }
      // day difference calculation
      const dayDifference = Math.ceil((checkout.getTime() - checkin.getTime()) / (1000 * 3600 * 24));
      if (dayDifference <= 0) {
        throw new Error('Invalid date range. Checkout date must be after checkin date.');
      }
      payload.price = parkingExists.price * dayDifference;
      payload.parkingHost = parkingExists.host; // Assuming parking host is the user who owns the parking property
      console.log("payload in createBooking 00000:", payload); // Debugging line to check payload before saving
      const booking = new ParkingBooking(payload);
      await booking.save();
      return booking;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while creating parking booking.');
      }
    }
  },

  getAllBookings: async (payload: IParkingBooking) => {
    try {
      const { status, userId, role, page, limit, sort } = payload;
      const currentPage = page ?? 1;
      const itemsPerPage = limit ?? 10;
      const skip = (currentPage - 1) * itemsPerPage;
      // const sortOption: Record<string, 1 | -1> | undefined =
      //   sort === 1 || sort === -1 ? { createdAt: sort } : undefined;
      const sortValue = Number(sort);
        const sortOption: Record<string, 1 | -1> =
  sortValue === 1 || sortValue === -1
    ? { createdAt: sortValue as 1 | -1 }
    : { createdAt: -1 };
      const filter: any = {};
      if (status) {
        filter.status = status;
      }
      if (role === 'host' && userId) {
        filter.parkingHost = userId; // Filter by parking host if the user is a
        // host
      } else if (role === 'user' && userId) {
        filter.user = userId; // Filter by user if the user is a regular user
      }
      console.log('Fetching parking bookings with filter:', filter); // Debugging line to check filter
      // return await ParkingBooking.find(filter)
      //   .skip(skip)
      //   .limit(itemsPerPage)
      //   .populate('parking')
      //   .populate('parkingHost', '-password')
      //   .populate({
      //     path: 'user',
      //     select: '-password',
      //   });
      const [data, total] = await Promise.all([
        ParkingBooking.find(filter)
          .skip(skip)
          .limit(itemsPerPage)
                    .sort(sortOption)
          .populate('parking')
          .populate('parkingHost', '-password')
          .populate({
            path: 'user',
            select: '-password',
          }),
        ParkingBooking.countDocuments(filter),
      ]);
      return { data, total };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching parking bookings.');
      }
    }
  },

  getById: async (id: string) => {
    try {
      return await ParkingBooking.findById(id)
        .populate('parking')
        .populate('parkingHost', '-password')
        .populate({
          path: 'user',
          select: '-password',
        });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching parking booking by ID.');
      }
    }
  },

  handleGetGuestBooking: async (userId: string, page: number, limit: number) => {
    try {
      // return await ParkingBooking.find({ user: userId })
      //   .populate('parking')
      //   .populate('parkingHost', '-password')
      //   .populate({
      //     path: 'user',
      //     select: '-password',
      //   });
            const currentPage = page ?? 1;
      const itemsPerPage = limit ?? 10;
      const skip = (currentPage - 1) * itemsPerPage;
            const [data, total] = await Promise.all([
        ParkingBooking.find({ user: userId })
          .skip(skip)
          .limit(itemsPerPage)
            .populate('parking')
        .populate('parkingHost', '-password')
        .populate({
          path: 'user',
          select: '-password',
        }),
        ParkingBooking.countDocuments({ user: userId }),
      ]);
      return { data, total };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching parking booking by ID.');
      }
    }
  },

  handleGetParkingByAllBooking: async (id: string) => {
    try {
      return await ParkingBooking.find({ parking: id })
        .populate('parking')
        .populate('parkingHost', '-password')
        .populate({
          path: 'user',
          select: '-password',
        });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching parking booking by ID.');
      }
    }
  },

  updateBookingStatus: async (id: string, data: Partial<IParkingBooking>) => {
    try {
      // Validate required fields
      if (!data.status) {
        throw new Error('Status is required to update parking booking.');
      }
      // Check if the booking exists
      const bookingExists = await ParkingBooking.findById(id);
      if (!bookingExists) {
        throw new Error('Parking booking does not exist.');
      }
      console.log('Updating parking booking with data:', data); // Debugging line to check update data
      return await ParkingBooking.findByIdAndUpdate(id, { ...data, updateRole: "admin" }, { new: true });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while updating parking booking.');
      }
    }
  },

  deleteBooking: async (id: string) => {
    try {
      const data = await ParkingBooking.findByIdAndDelete(id);
      if (!data) {
        throw new Error('Parking booking does not exist.');
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while deleting parking booking.');
      }
    }
  },

  handleParkingBookingHostEarning: async ({ payload }: { payload: { formDate: string; toDate: string; userId: string } }) => {
    try {
      const { formDate, toDate, userId } = payload;

      // Ensure toDate is after formDate
      if (toDate <= formDate) {
        throw new Error('toDate must be after formDate.');
      }
      // Calculate total earnings for the host within the specified date range
      console.log('Calculating total earnings for host:', userId, 'from', formDate, 'to', toDate); // Debugging line


      const totalEarnings = await ParkingBooking.find({
        parkingHost: userId,
        status: 'checked_out',
        checkinDate: { $gte: formDate },
        checkoutDate: { $lte: toDate },
      }).populate('parking').populate('parkingHost', '-password')
        .populate({
          path: 'user',
          select: '-password',
        })
        .select('price checkinDate checkoutDate parking')
        .sort({ checkinDate: 1 }); // Sort by checkinDate for better readability

      console.log('Total earnings calculated:', totalEarnings); // Debugging line
      if (!totalEarnings || totalEarnings.length === 0) {
        return { totalEarnings: 0, bookings: [] };
      }
      const earnings = totalEarnings.reduce((acc, booking) => acc + (booking.price ?? 0), 0);
      console.log('Total earnings:', earnings); // Debugging line
      return { totalEarnings: earnings, bookings: totalEarnings };


    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while calculating host earnings.');
      }

    }
  },
  countAvailableParkings: async () => {
    try {
      return await ParkingBooking.countDocuments({ status: 'available' });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while counting available parkings.');
      }
    }
  },

  getAvailableParkings: async () => {
    try {
      return await ParkingBooking.find({ status: 'available' }).populate('parking');
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('Unknown error occurred while fetching available parkings.');
      }
    }
  },

};

export default ParkingBookingRepository;

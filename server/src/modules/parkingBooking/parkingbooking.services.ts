import { IParkingBooking, ParkingBookingStatus } from './parkingbooking.interfaces';
import ParkingBookingRepository from './parkingbooking.repositors';

const ParkingBookingService = {
  createBooking: async (payload: IParkingBooking) => {
    try {
      return await ParkingBookingRepository.createBooking(payload);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Create Parking Booking Service');
    }
  },

  getAllBookings: async (payload: IParkingBooking) => {
    try {
      
      return await ParkingBookingRepository.getAllBookings(payload);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Get All Parking Bookings Service');
    }
  },

  getBookingById: async (id: string) => {
    try {
      return await ParkingBookingRepository.getById(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Get Parking Booking By ID Service');
    }
  },

    handleGetGuestBooking: async (userId: string, page: number , limit: number) => {
    try {
      return await ParkingBookingRepository.handleGetGuestBooking(userId, page, limit);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Get Parking Booking By ID Service');
    }
  },

    handleGetParkingByAllBooking: async (id: string) => {
    try {
      return await ParkingBookingRepository.handleGetParkingByAllBooking(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Get Parking Booking By ID Service');
    }
  },

  updateBookingStatus: async (id: string, status: ParkingBookingStatus) => {
    try {
      return await ParkingBookingRepository.updateBookingStatus(id, { status });
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Update Parking Booking Status Service');
    }
  },

  deleteBooking: async (id: string) => {
    try {
      return await ParkingBookingRepository.deleteBooking(id);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Delete Parking Booking Service');
    }
  },

  handleParkingBookingHostEarning: async ({payload}: { payload: any }) => {
    try {
      const { formMonth, toMonth } = payload;
      if (!formMonth || !toMonth) {
        throw new Error('Form month and to month are required for host earnings calculation.');
      }
      const {formYear , toYear} = payload;
      if (!formYear || !toYear) {
        throw new Error('Form year and to year are required for host earnings calculation.');
      }
      // months come string format, so we need to convert them to numbers
      const formMonthNumber = parseInt(formMonth, 10);
      const toMonthNumber = parseInt(toMonth, 10);
      if (isNaN(formMonthNumber) || isNaN(toMonthNumber)) {
        throw new Error('Invalid month format. Please provide valid month numbers.');
      }
      if (formMonthNumber < 1 || formMonthNumber > 12 || toMonthNumber < 1 || toMonthNumber > 12) {
        throw new Error('Month numbers must be between 1 and 12.');
      }
      if (formYear < 2000 || toYear < 2000) {
        throw new Error('Year must be greater than or equal to 2000.');
      }
      // form month and year to make a date, month date is 1st of the month
      console.log('Form Month:', formMonthNumber, 'To Month:', toMonthNumber, 'Form Year:', formYear, 'To Year:', toYear); // Debugging line to check values
      const formDate = new Date(formYear, formMonthNumber - 1, 1);
      console.log('Form Date:', formDate); // Debugging line to check formDate
      // to month and year to make a date, month date is last  of the month 
      const toDate = new Date(toYear, toMonthNumber, 0); // 0th day of next month gives last day of current month
      if (formDate > toDate) {
        throw new Error('Form date cannot be after to date.');
      }
      payload.formDate = formDate;
      payload.toDate = toDate;
      return await ParkingBookingRepository.handleParkingBookingHostEarning({payload});
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Get Parking Booking Stats Service');
    }
  },

  getAvailableParkings: async () => {
    try {
      return await ParkingBookingRepository.getAvailableParkings();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Get Available Parkings Service');
    }
  },

  countAvailableParkings: async () => {
    try {
      return await ParkingBookingRepository.countAvailableParkings();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown Error Occurred In Count Available Parkings Service');
    }
  },
};

export default ParkingBookingService;

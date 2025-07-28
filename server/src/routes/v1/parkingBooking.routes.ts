import { Router } from 'express';
import ParkingBookingController from '../../modules/parkingBooking/parkingbooking.controllers';
import UserMiddlewares from '../../modules/user/user.middlewares';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';

const router = Router();
const {
  handleCreateParkingBooking,
  handleGetAllParkingBookings,
  handleGetParkingBookingById,
  handleGetParkingByAllBooking,
  handleGetGuestBooking,
  handleUpdateParkingBookingStatus,
  handleDeleteParkingBooking,
  handleParkingBookingHostEarning,
  handleAvailableParkingStats,
  handlePaymentSuccess,
  handlePaymentFail,
  handlePaymentCancel,
  handlePaymentIPN
} = ParkingBookingController;

const { checkAccessToken, allowRole } = UserMiddlewares;

// USER: Create booking
router
  .route('/booking/parking')
  .post(checkAccessToken, handleCreateParkingBooking)
  .get(checkAccessToken, handleGetAllParkingBookings);

router
  .route('/payment/success')
  .post(handlePaymentSuccess);

router
  .route('/payment/fail')
  .post(handlePaymentFail);

router
  .route('/payment/cancel')
  .post(handlePaymentCancel);

router
  .route('/payment/ipn')
  .post(handlePaymentIPN);

router
  .route('/parking/bookings/:id')
  .get(checkAccessToken, handleGetParkingBookingById)

router
  .route('/parking/:id/bookings')
  .get(handleGetParkingByAllBooking)
router
  .route('/guest/parking/bookings')
  .get(checkAccessToken, handleGetGuestBooking)

// ADMIN: Get single booking / Delete booking
router
  .route('/admin/parking/bookings/:id')
  .get(checkAccessToken, allowRole(UserRole.Admin), handleGetParkingBookingById)
  .delete(checkAccessToken, allowRole(UserRole.Admin), handleDeleteParkingBooking);

// ADMIN: Update booking status
router
  .route('/admin/parking/bookings/:id/status')
  .patch(checkAccessToken, allowRole(UserRole.Admin), handleUpdateParkingBookingStatus);

// HOST: Booking stats (group by status)
router
  .route('/host/parking/bookings/earnings')
  .get(checkAccessToken, handleParkingBookingHostEarning);

// router
//   .route('/admin/parking/available')
//   .get(checkAccessToken, allowRole(UserRole.Admin), handleAvailableParkingStats);

// ADMIN: Sold-out prakings list + count
// router
//   .route('/admin/parking/soldout')
//   .get(checkAccessToken, allowRole(UserRole.Admin), handleSoldOutParkingStats);

export default router;

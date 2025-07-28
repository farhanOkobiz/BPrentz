import { Schema, model, Model } from 'mongoose';
import { IParkingBooking, ParkingBookingStatus } from './parkingbooking.interfaces';

const ParkingBookingSchema = new Schema<IParkingBooking>(
  {
    parking: { type: Schema.Types.ObjectId, ref: 'Parking', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    parkingHost: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    checkinDate: { type: Date, default: null },
    checkoutDate: { type: Date, default: null },
    guestCount: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(ParkingBookingStatus),
      default: ParkingBookingStatus.PENDING,
    },
    updateRole: { type: String, default: 'host' },
  },
  {
    timestamps: true
  }
);

// Add payment-related fields
ParkingBookingSchema.add({
  transactionId: { type: String, default: null },
  paymentStatus: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'], default: 'PENDING' },
  paymentGateway: { type: String, default: 'SSLCommerz' },
  paymentDetails: { type: Object, default: null }, 
});

ParkingBookingSchema.index({ parking: 1, email: 1 }, { unique: false });

const ParkingBooking: Model<IParkingBooking> = model<IParkingBooking>('ParkingBooking', ParkingBookingSchema);

export default ParkingBooking;

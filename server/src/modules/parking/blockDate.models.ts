import { HydratedDocument, model, Model, Schema, Types } from 'mongoose';
import SlugUtils from '../../utils/slug.utils';
import { IBlockdate } from './parking.interfaces';


const BlockdateParkingSchema = new Schema<IBlockdate>({
  parking: { type: Types.ObjectId, ref: 'Parking', require: true },
  blockDate: { type: Date, default: null },

});



BlockdateParkingSchema.index(
  { category: 1 },
  { unique: true, partialFilterExpression: { category: { $type: 'objectId' } } }
);
const BlockdateParking: Model<IBlockdate> = model<IBlockdate>('BlockdateParking', BlockdateParkingSchema);

export default BlockdateParking;

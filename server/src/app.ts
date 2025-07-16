import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { morganMessageFormat, streamConfig } from './configs/morgan.configs';
import corsConfiguration from './configs/cors.configs';
import { baseUrl } from './const';
import { globalErrorMiddleware } from './middlewares/globalError.middleware';
import cookieParser from 'cookie-parser';
import multer from 'multer';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(multer().none());
app.use(cookieParser());
app.use(cors(corsConfiguration));
app.use(express.static('public'));
app.use('/api/v1/public', express.static('public'));
app.use(
  morgan(morganMessageFormat, {
    stream: {
      write: (message: string) => streamConfig(message),
    },
  })
);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Server Is Running' });
});

/* ====================================|
|------------APP ROUTES V1-------------|
|==================================== */

import {
  BlogRoutes,
  ProfileRoutes,
  UserRoutes,
  FeatureRoutes,
  CategoryRoutes,
  FaqRoutes,
  MissionRoutes,
  VissionRoutes,
  WhyChooseUs,
  Partner,
  Banner,
  Team,
  AboutUS,
  SubCategory,
  Amenities,
  Location,
  Rent,
  Flat,
  Land,
  Contacts,
  RentBookingRoutes,
  FlatBookingRoutes,
  LandBookingRoutes,
  BookingRentRoutes,
  BlockDateRentRoutes,
  // PaymentRoutes,
} from './routes/v1';

app.use(baseUrl.v1, UserRoutes);
app.use(baseUrl.v1, ProfileRoutes);
app.use(baseUrl.v1, BlogRoutes);
app.use(baseUrl.v1, FeatureRoutes);
app.use(baseUrl.v1, CategoryRoutes);
app.use(baseUrl.v1, FaqRoutes);
app.use(baseUrl.v1, MissionRoutes);
app.use(baseUrl.v1, VissionRoutes);
app.use(baseUrl.v1, WhyChooseUs);
app.use(baseUrl.v1, Partner);
app.use(baseUrl.v1, Banner);
app.use(baseUrl.v1, Team);
app.use(baseUrl.v1, AboutUS);
app.use(baseUrl.v1, SubCategory);
app.use(baseUrl.v1, Amenities);
app.use(baseUrl.v1, Location);
app.use(baseUrl.v1, Rent);
app.use(baseUrl.v1, Flat);
app.use(baseUrl.v1, Land);
app.use(baseUrl.v1, Contacts);
app.use(baseUrl.v1, RentBookingRoutes);
app.use(baseUrl.v1, FlatBookingRoutes);
app.use(baseUrl.v1, LandBookingRoutes);
app.use(baseUrl.v1, BookingRentRoutes);
app.use(baseUrl.v1,BlockDateRentRoutes)
// app.use(baseUrl.v1, PaymentRoutes);


app.use(globalErrorMiddleware);

export default app;

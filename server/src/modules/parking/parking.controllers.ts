import { NextFunction, Request, Response } from 'express';
import logger from '../../configs/logger.configs';
import ParkingServices from './parking.services';
import mongoose from 'mongoose';
import IParking, { IGetAllParkingRequestedQuery, IParkingImagesPath } from './parking.interfaces';
import { documentPerPage } from '../../const';

const {
  processInitializeParkingListing,
  processProgressParkingListing,
  processUploadImage,
  processUnlinkImage,
  processHostListedParkingProperties,
  processChangeStatus,
  processGetAllListedParking,
  processDeleteListedParkingItem,
  processCreateParking,
  processRetrieveOneListedParking,
  processRetrieveOneListedParkingById,
  processGetParkingField,
  searchParkingListings,
  handleParkingDateBlockList,
  handleGetParkingDateBlockList,
  processSetParkingSelected
} = ParkingServices;
const ParkingControllers = {
  handleRetrieveOneListedParking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const data = await processRetrieveOneListedParking({ slug });
      res.status(201).json({
        status: 'success',
        message: 'Parking Retrieve Successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleRetrieveOneListedParkingById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const parkingId = new mongoose.Types.ObjectId(id);
      const data = await processRetrieveOneListedParking({ parkingId });
      res.status(201).json({
        status: 'success',
        message: 'Parking Retrieve Successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleInitializeParkingListing: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const { listingFor } = req.body;
      const payload = { listingFor } as IParking;
      const data = await processInitializeParkingListing({
        payload,
        host: userId,
      });
      res.status(201).json({
        status: 'success',
        message: 'new parking listing initialized',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleProgressCreatingParkingListing: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      if (status) {
        res.status(403).json({
          status: 'error',
          message: 'You are not allowed to modify the status field.',
        });
      }
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const parkingId = new mongoose.Types.ObjectId(id);
      const payload = req.body;
      const data = await processProgressParkingListing({
        parkingId,
        payload,
      });
      res.status(200).json({
        status: 'success',
        message: 'New Field Data Added',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleCreateParking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const payload = req.body as IParking;
      payload.host = userId;
      const images = (req?.files as IParkingImagesPath[])?.map((item) => item.filename);
      const data = await processCreateParking({ images, payload });
      res.status(200).json({
        status: 'success',
        message: 'New Parking Created',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUploadImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      console.log('id ------', id);
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const parkingId = new mongoose.Types.ObjectId(id);
      const images = (req?.files as IParkingImagesPath[])?.map((item) => item.filename);
      if (images === undefined || images.length === 0) {
        res.status(400).json({ status: 'error', message: 'No images uploaded' });
        return;
      }
      const data = await processUploadImage({ images, parkingId });
      res.status(200).json({
        status: 'success',
        message: 'Image upload successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleUnlinkImage: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const parkingId = new mongoose.Types.ObjectId(id);
      const { images, imageUrl } = req.body;
      await processUnlinkImage({
        parkingId,
        images,
        singleImage: imageUrl as string,
      });
      res.status(200).json({
        status: 'success',
        message: 'Image delete successful',
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleGetAllHostListedPropertiesForParking: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const host = userId;
      const { page, limit, } = req.query as IGetAllParkingRequestedQuery;
      const {data, total} = await processHostListedParkingProperties({ host, page, limit });
      res.status(200).json({
        status: 'success',
        message: 'Listed Properties For Parking Retrieve successful',
        totalContacts: total,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

    handleParkingDateBlockList: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { userId } = req.authenticateTokenDecoded;
      const payload = req.body;
      const host = userId.toString();
      const data = await handleParkingDateBlockList({ host, payload });
      res.status(200).json({
        status: 'success',
        message: 'Listed Properties For Parking Retrieve successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },

  handleGetParkingDateBlockList: async (
    req: Request, res: Response, next: NextFunction
  ) => { 
    try {
       const payload = req.query as { parkingId?: string };
      const data = await handleGetParkingDateBlockList({  payload  });
      res.status(200).json({
        status: 'success',
        message: 'Listed Properties For Parking Retrieve successful',
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next(error);
    }
  },
  handleChangeStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const parkingId = new mongoose.Types.ObjectId(id);
      const { status } = req.body;
      const payload: IParking = {
        status,
      };
      const data = await processChangeStatus({ parkingId, payload });
      res.status(200).json({
        status: 'success',
        message: `Listed item status Changed to ${status}`,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleGetAllParking: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, page, sort, search, category } = req.query as IGetAllParkingRequestedQuery;
      const { data, total } = await processGetAllListedParking({
        search,
        status,
        page,
        sort,
        category,
      });
      const totalPages = Math.ceil(total / documentPerPage);
      const totalParkings = total;
      const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;

      const buildQuery = (pageNumber: number) => {
        const query = new URLSearchParams();
        if (search) query.set('search', search);
        if (status) query.set('status', status);
        if (sort) query.set('sort', String(sort));
        if (category) query.set('category', String(category));
        if (pageNumber !== 1) query.set('page', String(pageNumber));

        const queryString = query.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
      };
      const currentPage = Number(page) || 1;
      const currentPageUrl = buildQuery(currentPage);
      const nextPageUrl = currentPage < totalPages ? buildQuery(currentPage + 1) : null;
      const previousPageUrl = currentPage > 1 ? buildQuery(currentPage - 1) : null;
      res.status(200).json({
        status: 'success',
        message: `All Listed Parking Item Retrieve successful`,
        totalParkings,
        totalPages,
        currentPageUrl,
        nextPageUrl,
        previousPageUrl,
        data,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },

  handleDeleteListedParkingItem: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'Invalid feature ID' });
        return;
      }
      const parkingId = new mongoose.Types.ObjectId(id);
      await processDeleteListedParkingItem({ parkingId });
      res.status(200).json({
        status: 'success',
        message: `Item delete successful`,
      });
    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();
    }
  },
  handleGetParkingField: async (req: Request, res: Response, next: NextFunction) => {

    try {
      const { id, field } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ status: 'error', message: 'invalid listing id' });
        return;
      }
      const data = await processGetParkingField({ id, field });
      res.status(200).json({
        status: 'success',
        message: `Parking field data get successfully`,
        data: data

      })

    } catch (error) {
      const err = error as Error;
      logger.error(err.message);
      next();

    }
  },
  HandleSearchParkingListings: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        location,
        checkinDate,
        checkoutDate,
        page,
        limit,
        sort,
        bedroomCount,
        bathCount,
        bedCount,
        guestCount,
        status,
        category,
      } = req.query;

      const payload = {
        location,
        checkinDate,
        checkoutDate,
        bedroomCount,
        bathCount,
        bedCount,
        guestCount,
        status,
        category,
      };

      const result = await searchParkingListings({
        payload,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : documentPerPage,
        sort: sort === "1" ? "1" : "-1",
      });

      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  },
handleSetParkingSelected: async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { selected } = req.body;

    const updated = await processSetParkingSelected({ id, selected });

    res.status(200).json({
      status: 'success',
      message: 'Parking selection updated',
      data: updated,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('maximum of 9')) {
       res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }
    next(error);
  }
},

};

export default ParkingControllers;

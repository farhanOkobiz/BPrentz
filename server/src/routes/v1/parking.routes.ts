import { Router } from 'express';
import UserMiddlewares from '../../modules/user/user.middlewares';
import ParkingControllers from '../../modules/parking/parking.controllers';
import upload from '../../middlewares/multer.middleware';
import { UserRole } from '../../interfaces/jwtPayload.interfaces';

const { checkAccessToken, isHost, allowRole } = UserMiddlewares;
const {
  handleInitializeParkingListing,
  handleProgressCreatingParkingListing,
  handleUploadImage,
  handleUnlinkImage,
  handleGetAllHostListedPropertiesForParking,
  handleParkingDateBlockList,
  handleGetParkingDateBlockList,
  handleChangeStatus,
  handleGetAllParking,
  handleDeleteListedParkingItem,
  handleCreateParking,
  handleRetrieveOneListedParking,
  handleRetrieveOneListedParkingById,
  handleGetParkingField,
  HandleSearchParkingListings,
  handleSetParkingSelected

} = ParkingControllers;
const router = Router();
router
  .route('/host/parking/image/:id')
  .patch(checkAccessToken, isHost, upload.array('images'), handleUploadImage)
  .delete(checkAccessToken, isHost, handleUnlinkImage);

router.route('/host/parking/new').post(checkAccessToken, isHost, handleInitializeParkingListing);
router
  .route('/host/create-new-parking')
  .post(checkAccessToken, isHost, upload.array('images'), handleCreateParking);
router.route('/host/parking/:id').patch(checkAccessToken, isHost, handleProgressCreatingParkingListing);



router.route('/host/parking').get(checkAccessToken, isHost, handleGetAllHostListedPropertiesForParking);
router.route('/host/parking/date-block-list')
.post(checkAccessToken, isHost, handleParkingDateBlockList)
.get( handleGetParkingDateBlockList);
router.route('/host/parking/:id').get(checkAccessToken, isHost, handleRetrieveOneListedParkingById);

router
  .route('/admin/parking/:id')
  .patch(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ListingVerificationManager),
    handleChangeStatus
  )
  .delete(
    checkAccessToken,
    allowRole(UserRole.Admin, UserRole.ListingVerificationManager),
    handleDeleteListedParkingItem
  );

router.route('/parking').get( handleGetAllParking);
router.route('/parking/:slug').get(handleRetrieveOneListedParking);
router
  .route('/host/parking/:id/field/:field')
  .get(checkAccessToken, isHost, handleGetParkingField);
router.route('/parking-search').get(HandleSearchParkingListings);
router.route('/admin/parking/:id/select').patch( checkAccessToken, allowRole(UserRole.Admin), handleSetParkingSelected);

export default router;
